import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Column } from 'typeorm';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @Column({
        type: 'bool',
        default: null
    })
    @IsOptional()
    imageUrl?: string;

    @Column({
        type: 'bool',
        default: true
    })
    @IsOptional()
    isActive?: boolean;

    //TODO film watches
    //TODO film pending
    //TODO film favorites

    @Column('text', {
        array: true,
        default: ['user']
    })
    @IsOptional()
    roles?: string[];
}
