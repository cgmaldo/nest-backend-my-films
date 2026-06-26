import { Film } from "src/film/entities/film.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
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

    //TODO film watches
    //TODO film pending
    //TODO film favorites

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
        { eager: true, cascade: true }
    )
    films?: Film[];

    @BeforeInsert()
    checkInsertEmail() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkUpdateEmail() {
        this.email = this.email.toLowerCase().trim();
    }
}