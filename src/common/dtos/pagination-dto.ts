import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({
        default: 'Define in .env',
        description: 'How many rows do you need to retrieve?',
        required: false,
    })
    @IsOptional()
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'How many rows are skipped when retrieving the data?',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}