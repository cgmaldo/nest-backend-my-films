import { Column } from 'typeorm';
import { IsEmail, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        example: 'email@domain.com',
        description: 'User email',
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
        message: 'The password must have min length of 8 characters. With a uppercase, lowercase, a number and an operator'
    })
    password: string;
}
