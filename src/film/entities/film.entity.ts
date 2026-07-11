import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypeFilm } from "../interfaces/typefilm.interface";
import { User } from "src/auth/entities/user.entity";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

@Entity()
export class Film {
    @ApiProperty({
        example: '3990ab78-e770-46f1-9744-2c56013a3216',
        description: 'Film ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: '972',
        description: 'ID in THE MOVIES DATA BASE ',
    })
    @Column('text')
    filmId: string;

    @ApiProperty({
        example: 'Sonrisas y lágrimas',
        description: 'Title of Movie in THE MOVIES DATA BASE',
    })
    @Column('text')
    title: string;

    @ApiProperty({
        example: '/AeasdasdfsdfWQzxAw4QpB43YfqxEF.jpg',
        description: 'URL image of films without prefix',
    })
    @Column('text', {
        nullable: true
    })
    posterPath: string;

    @ApiProperty({
        example: '2026-07-09 15:02:57.196+00',
        default: 'Current date: CURRENT_TIMESTAMP',
        description: 'Film date',
    })
    @Column({
        type: 'timestamptz',
        precision: 3,
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    })
    date: Date;

    @ApiProperty({
        name: 'type',
        enum: TypeFilm,
        example: 'watched',
        description: 'Kind of film record',
    })
    @Column({
        type: "enum",
        enum: TypeFilm,
        default: TypeFilm.WATCHED,
    })
    type: TypeFilm;

    @ApiHideProperty()
    @ManyToOne(
        () => User,
        (user) => user.films,
        { onDelete: 'CASCADE' }
    )
    user: User;
}
