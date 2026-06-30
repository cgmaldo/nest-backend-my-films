import { IsIn, IsString, IsUUID, MinLength } from "class-validator"
import { TypeFilm } from "../interfaces/typefilm.interface";
import { User } from "src/auth/entities/user.entity";

export class CreateFilmDto {
    @IsString()
    filmId: string;

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    posterPath: string;

    @IsString()
    @IsIn(Object.values(TypeFilm))
    type: TypeFilm;
}