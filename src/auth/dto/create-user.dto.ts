import { IsEmail, IsString, Matches, MinLength, minLength } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column } from "typeorm";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    // Longitud minima de 8 una mayuscula una minuscula un numero y signo de puntuación
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message: 'The password must have min length of 8 characters. With a uppercase, lowercase, a number and an operator'
    })
    password: string;

    @IsString()
    @MinLength(1)
    firstName: string;

    @IsString()
    @MinLength(1)
    lastName: string;

    //TODO imagen profile

    @BeforeInsert()
    checkInsertEmail() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkUpdateEmail() {
        this.email = this.email.toLowerCase().trim();
    }
}
