import { Film } from "src/film/entities/film.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserOrigins } from "../interfaces/user-origin.interface";

@Entity()
@Index(["email", "origin"], { unique: true })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
    })
    email: string;

    @Column({
        type: 'text',
        default: null,
        select: false,
    })
    password: string | null;

    @Column({
        type: 'text',
    })
    firstName: string;

    @Column({
        type: 'text',
    })
    lastName: string;

    @Column({
        type: 'text',
        default: ''
    })
    imageUrl: string;

    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column({
        type: 'timestamptz',
        precision: 3,
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: Date;

    @Column({
        type: 'timestamptz',
        precision: 3,
        nullable: true,
    })
    updatedAt: Date;

    @OneToMany(
        () => Film,
        (film) => film.user,
    )
    films: Film[];

    @Column({
        type: "enum",
        enum: Object.values(UserOrigins),
    })
    origin: string;

    @BeforeInsert()
    checkInsertEmail() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkUpdateEmail() {
        this.email = this.email.toLowerCase().trim();
    }
}