import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { PaginationDto } from '../common/dtos/pagination-dto';
import { ConfigService } from '@nestjs/config';
import { TypeFilm } from './interfaces/typefilm.interface';
import { FilmSearchDto } from 'src/common/dtos/film-search-dto';

@Injectable()
export class FilmService {
  private readonly logger = new Logger('Auth');

  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    private readonly configService: ConfigService,
  ) { }

  async create(createFilmDto: CreateFilmDto, userLogged: User) {
    try {
      const film = this.filmRepository.create({
        ...createFilmDto,
        user: userLogged
      });
      await this.filmRepository.save(film);
      return {
        ...film
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(typeFilm: TypeFilm, filmSearchDto: FilmSearchDto, user: User) {
    try {
      const { limit = this.configService.get('PAGESIZE'), offset = 0, term = '' } = filmSearchDto;
      const queryBuilder = this.filmRepository.createQueryBuilder('film');
      const films = await queryBuilder
        .select(["film.id", "film.filmId", "film.title", "film.posterPath", "film.date"])
        .where('film.userId=:who', { who: user.id })
        .andWhere('film.type=:typeFilm', { typeFilm: typeFilm })
        .andWhere(
          'UPPER(title) like :title', {
          title: `%${term.toUpperCase()}%`,
        })
        .take(limit)
        .skip(offset)
        .orderBy('type', 'ASC')
        .addOrderBy('film.date', 'ASC')
        .getManyAndCount()
      const count = films[1];
      if (count === 0) {
        return {
          films: [],
          numPages: 0
        };
      }
      const numPages = count < limit! ? 1 : Math.ceil(count / limit!);
      return {
        films: films[0],
        numPages
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(idFilm: string, user: User) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const film = await this.filmRepository.findOne({
      relations: { user: true },
      where: { id: idFilm },
    });
    if (!film || film && film.user.id !== user.id) {
      throw new NotFoundException('Film not found');
    }
    const { user: user2, ...filmWithoutUser } = film;
    return {
      ...filmWithoutUser
    };
  }

  async update(id: string, updateFilmDto: UpdateFilmDto, user: User) {
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const film = await this.findOne(id, user);
    try {
      const updateFilm = {
        ...film,
        ...updateFilmDto,
        date: new Date(),
      }
      await this.filmRepository.save(updateFilm);
      return updateFilm;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string, user: User) {
    const film = await this.findOne(id, user);
    try {
      await this.filmRepository.delete(film);
      return film;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error check server logs');
  }
}
