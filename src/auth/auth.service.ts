import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from '../common/dtos/pagination-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.configService.get('PAGESIZE'), offset = 0 } = paginationDto;
    try {
      return await this.userRepository.find(
        {
          take: limit,
          skip: offset,
          // TODO Relaciones
        });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(term: string) {
    let user;
    if (isUUID(term)) {
      user = await this.userRepository.findOne({
        where: { id: term },
        select: { password: false },
        //TODO relations films
      });
    }
    if (!user) {
      user = await this.userRepository.findOne({
        where: { email: term },
        select: { password: false },
        //TODO relations films
      });
    }
    if (!user) {
      throw new NotFoundException(`Not found user with term "${term}"`);
    }
    return user;
  }

  async update(term: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: term,
      ...updateUserDto
    });
    if (!user) {
      throw new NotFoundException(`User with term "${term}" not found`);
    }
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    this.userRepository.remove(user);
    return user;
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error check server logs');
  }
}
