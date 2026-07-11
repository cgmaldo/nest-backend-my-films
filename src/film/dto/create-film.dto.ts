import { IsIn, IsString, IsUUID, MinLength } from "class-validator"
import { TypeFilm } from "../interfaces/typefilm.interface";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFilmDto {
    @ApiProperty({
        example: 972,
        description: 'ID in THE MOVIES DATA BASE ',
    })
    @IsString()
    filmId: string;

    @ApiProperty({
        example: 'Sonrisas y lágrimas',
        description: 'Title of Movie in THE MOVIES DATA BASE',
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: '/AeasdasdfsdfWQzxAw4QpB43YfqxEF.jpg',
        description: 'URL image of films without prefix',
    })
    @IsString()
    posterPath: string;

    @ApiProperty({
        name: 'type',
        enum: TypeFilm,
        example: 'watched',
        description: 'Kind of film record',
    })
    @IsString()
    @IsIn(Object.values(TypeFilm))
    type: TypeFilm;
}