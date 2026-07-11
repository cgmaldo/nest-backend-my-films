import { Film } from "src/film/entities/film.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserOrigins } from "../interfaces/user-origin.interface";
import { ApiExtraModels, ApiHideProperty, ApiProperty, ApiSchema } from "@nestjs/swagger";
import { ValidRoles } from "../interfaces/valid-roles";

@Entity()
@Index(["email", "origin"], { unique: true })
export class User {
    @ApiProperty({
        example: '3990ab78-e770-46f1-9744-2c56013a3216',
        description: 'User ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'email@domain.com',
        description: 'User email. ',
    })
    @Column({
        type: 'text',
    })
    email: string;

    @ApiProperty({
        example: 'Zyx87654321,',
        description: 'Min long 8 characters. Must contains a uppercase, lowercase, number and operator',
    })
    @Column({
        type: 'text',
        default: null,
        select: false,
    })
    password: string | null;

    @ApiProperty({
        example: 'Firstname',
        description: 'Min length 1 character',
    })
    @Column({
        type: 'text',
    })
    firstName: string;

    @ApiProperty({
        example: 'Lastname',
        description: 'Min length 1 character',
    })
    @Column({
        type: 'text',
    })
    lastName: string;

    @ApiProperty({
        example: 'myphoto.png',
        default: '',
        description: 'Profile photo',
    })
    @Column({
        type: 'text',
        default: ''
    })
    imageUrl: string;

    @ApiProperty({
        example: true,
        default: true,
        description: 'User active o inactive',
    })
    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        enum: ValidRoles,
        isArray: true,
        example: [ValidRoles.admin, ValidRoles.user]
    })
    @ApiProperty({
        example: '["user","admin"]',
        default: '["user"]',
        description: 'Set user roles',
    })
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @ApiProperty({
        example: '2026-07-09 15:02:57.196+00',
        default: 'Current date: CURRENT_TIMESTAMP',
        description: 'Use create date',
    })
    @Column({
        type: 'timestamptz',
        precision: 3,
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: Date;

    @ApiProperty({
        example: '2026-07-09 15:02:57.196+00',
        default: 'Current date: CURRENT_TIMESTAMP',
        description: 'User last update date',
    })
    @Column({
        type: 'timestamptz',
        precision: 3,
        nullable: true,
    })
    updatedAt: Date;

    @ApiHideProperty()
    @OneToMany(
        () => Film,
        (film) => film.user,
    )
    films: Film[];

    @ApiProperty({ enum: UserOrigins, enumName: 'UserOrigins' })
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