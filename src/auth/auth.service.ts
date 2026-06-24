import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { UserSearchDto } from '../common/dtos/user-search-dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user-dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth');
  private limit: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.limit = this.configService.get('PAGESIZE') || 20
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const passwordEncrypted = bcrypt.hashSync(password, 10);
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: passwordEncrypted
      });
      await this.userRepository.save(newUser);
      const { password: password2, ...userWithoutPassword } = newUser;
      return {
        ...userWithoutPassword,
        token: this.getJwtToken({ id: userWithoutPassword.id })
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(userSearchDto: UserSearchDto) {
    const { term = '', limit = this.limit, offset = 0 } = userSearchDto;
    if (term === '') {
      return await this.userRepository.find({
        take: limit,
        skip: offset,
      })
    }
    try {
      // 'UPPER(user.firstName) Like :firstName or UPPER(lastName) Like :lastName or UPPER(email) Like :email', {
      const queryBuilder = this.userRepository.createQueryBuilder();
      const users = await queryBuilder
        .where(
          'UPPER(User.firstName) like :firstName or UPPER(User.lastName) Like :lastName or UPPER(User.email) Like :email', {
          firstName: `%${term.toUpperCase()}%`,
          lastName: `%${term.toUpperCase()}%`,
          email: `%${term.toUpperCase()}%`,
        })
        .take(limit)
        .skip(offset)
        .getMany();
      return users;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(term: string) {
    let user;
    if (isUUID(term)) {
      user = await this.userRepository.findOne({
        where: { id: term },
        select: { password: false },
        //TODO relations films
      });
    }
    if (!user) {
      const queryBuilder = this.userRepository.createQueryBuilder();
      user = await queryBuilder
        .where(
          'UPPER(User.firstName) like :firstName or UPPER(User.lastName) Like :lastName or UPPER(User.email) Like :email', {
          firstName: `%${term.toUpperCase()}%`,
          lastName: `%${term.toUpperCase()}%`,
          email: `%${term.toUpperCase()}%`,
        })
        .getOne();
    }
    if (!user) {
      throw new NotFoundException(`Not found user with term "${term}"`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    if (updateUserDto.password) {
      user.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    this.userRepository.remove(user);
    return user;
  }


  async loginEmailPassword(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true, firstName: true, lastName: true, roles: true }
    })
    if (!user || !bcrypt.compareSync(password, user.password!)) {
      throw new UnauthorizedException('Email/Password are not valid')
    }
    const { password: password2, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token: this.getJwtToken({ id: userWithoutPassword.id })
    };
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error check server logs');
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token
  }
}
