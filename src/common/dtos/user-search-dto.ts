import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "./pagination-dto";

export class UserSearchDto extends PaginationDto {
    @IsOptional()
    @IsString()
    term?: string;
}