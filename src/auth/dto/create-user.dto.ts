import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Matches, MinLength, minLength } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column } from "typeorm";

export class CreateUserDto {
    @ApiProperty({
        example: 'email@domain.com',
        description: 'User email. ',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Zyx87654321,',
        description: 'Min long 8 characters. Must contains a uppercase, lowercase, number and operator',
    })
    @IsString()
    // Longitud minima de 8 una mayuscula una minuscula un numero y signo de puntuación
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message: 'The password must have min length of 8 characters. With a uppercase, lowercase, number and an operator'
    })
    password: string;

    @ApiProperty({
        example: 'Firstname',
        description: 'Min length 1 character',
    })
    @IsString()
    @MinLength(1)
    firstName: string;

    @ApiProperty({
        example: 'Lastname',
        description: 'Min length 1 character',
    })
    @IsString()
    @MinLength(1)
    lastName: string;

    @ApiProperty({
        example: 'myphoto.png',
        default: '',
        description: 'Profile photo',
        required: false,
    })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @BeforeInsert()
    checkInsertEmail() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkUpdateEmail() {
        this.email = this.email.toLowerCase().trim();
    }
}
