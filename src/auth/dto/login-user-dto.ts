import { Column } from 'typeorm';
import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginUserDto {
    @Column({
        type: 'string',
    })
    @IsEmail()
    email: string;

    @Column({
        type: 'text',
    })
    @IsString()
    // Longitud minima de 8 una mayuscula una minuscula un numero y signo de puntuación
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message: 'The password must have min length of 8 characters. With a uppercase, lowercase, a number and an operator'
    })
    password: string;
}
