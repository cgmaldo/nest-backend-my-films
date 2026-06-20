import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @BeforeInsert()
    checkInsertEmail() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkUpdateEmail() {
        this.email = this.email.toLowerCase().trim();
    }
}