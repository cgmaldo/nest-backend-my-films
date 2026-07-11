import { IsIn, IsString } from 'class-validator';
import { TypeFilm } from '../interfaces/typefilm.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFilmDto {
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
