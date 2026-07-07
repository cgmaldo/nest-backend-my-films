import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypeFilm } from "../interfaces/typefilm.interface";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class Film {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    filmId: string;

    @Column('text')
    title: string;

    @Column('text', {
        nullable: true
    })
    posterPath: string;

    @Column({
        type: 'timestamptz',
        precision: 3,
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    })
    date: Date;

    @Column({
        type: "enum",
        enum: TypeFilm,
        default: TypeFilm.WATCHED,
    })
    type: TypeFilm;

    @ManyToOne(
        () => User,
        (user) => user.films,
        { onDelete: 'CASCADE' }
    )
    user: User;
}
