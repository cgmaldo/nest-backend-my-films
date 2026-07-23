import { Injectable } from '@nestjs/common';
import { TypeFilm } from 'src/film/interfaces/typefilm.interface';
import { FilmService } from '../film/film.service';
import { AuthService } from 'src/auth/auth.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Film } from 'src/film/entities/film.entity';
import { User } from 'src/auth/entities/user.entity';
import { CommonModule } from '../common/common.module';
import { CommonService } from '../common/common.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly commonService: CommonService,
    private readonly filmService: FilmService,
    private readonly authService: AuthService,
  ) { }

  async importBackup(userId: string, typeFilm: TypeFilm) {
    const user = await this.authService.findOne(userId);
    await this.filmService.removeType(userId, typeFilm);
    const films = this.readFileTypeFilm(typeFilm);
    const resp = await this.insertNewFilms(films, user);
    return {
      ok: resp,
      message: 'Seed user films completed',
      count: films.length,
    }
  }

  private readFileTypeFilm(typeFilm: TypeFilm) {
    let data: string = '';
    try {
      data = readFileSync(join(__dirname, '/data', `${typeFilm}.json`), 'utf-8');
    } catch (error: any) {
      this.commonService.handleError(error);
    }
    const parseData = JSON.parse(data);
    for (const film of parseData) {
      const partsDocument = film['Document ID'].split('/');
      delete film['Document ID'];
      film.filmId = +partsDocument[partsDocument.length - 1];
      film.posterPath = film.poster_path;
      delete film['poster_path'];
      film.type = typeFilm;
    }
    return parseData;
  }

  private async insertNewFilms(films: Film[], user: User) {
    const insertPromises: any[] = [];
    films.forEach(film => {
      insertPromises.push(this.filmService.create(film, user));
    })
    await Promise.all(insertPromises);
    return true;
  }
}
