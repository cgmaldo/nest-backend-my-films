import { IsIn, IsString, MinLength } from "class-validator"
import { Column } from "typeorm"
import { TypeFilm } from "../interfaces/typefilm.interface";
import { User } from "src/auth/entities/user.entity";

export class CreateFilmDto {
    @IsString()
    filmId: string;

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    posterPath: string | null;

    @IsIn(Object.values(TypeFilm))
    type: TypeFilm;
}