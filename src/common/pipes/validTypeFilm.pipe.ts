import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { TypeFilm } from 'src/film/interfaces/typefilm.interface';

export class ValidTypeFilmPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (Object.values(TypeFilm).includes(value)) {
            return value;
        } else {
            throw new BadRequestException(`${value} is\'n a valid value`);
        }
    }
}