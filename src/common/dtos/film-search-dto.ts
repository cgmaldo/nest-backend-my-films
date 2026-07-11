import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "./pagination-dto";
import { ApiProperty } from "@nestjs/swagger";

export class FilmSearchDto extends PartialType(PaginationDto) {
    @ApiProperty({
        default: '""',
        description: 'Search term by film name',
        required: false,
    })
    @IsOptional()
    @IsString()
    term?: string;
}