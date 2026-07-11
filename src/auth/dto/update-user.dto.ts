// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Column } from 'typeorm';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidRoles } from '../interfaces/valid-roles';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        example: 'myphoto.png',
        default: '',
        description: 'Profile photo',
        required: false,
    })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({
        example: true,
        default: true,
        description: 'User active o inactive',
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({
        example: '["user","admin"]',
        default: '["user"]',
        description: 'Set user roles',
        required: false,
    })
    @ApiProperty({
        enum: ValidRoles,
        isArray: true,
        example: [ValidRoles.admin, ValidRoles.user],
        default: [ValidRoles.user],
    })
    @Column('text', {
        array: true,
        default: ['user']
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    roles?: string[];
}
