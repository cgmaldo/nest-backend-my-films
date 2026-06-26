import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Column } from 'typeorm';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    roles?: string[];
}
