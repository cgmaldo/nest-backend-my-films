import { PartialType } from '@nestjs/mapped-types';
import { CreateFilmDto } from './create-film.dto';
import { IsIn, IsString } from 'class-validator';
import { TypeFilm } from '../interfaces/typefilm.interface';

export class UpdateFilmDto {
    @IsString()
    @IsIn(Object.values(TypeFilm))
    type: TypeFilm;
}
