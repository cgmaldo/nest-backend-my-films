import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { join } from 'path';
import bcrypt from 'bcrypt';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { User } from './entities/user.entity';
import { UserSearchDto } from '../common/dtos/user-search-dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserOrigins } from './interfaces/user-origin.interface';
import { existsSync, unlinkSync } from 'fs';
import { CommonService } from '../common/common.service';

@Injectable()
export class AuthService {
  private limit: number;

  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.limit = this.configService.get('PAGESIZE') || 20
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const passwordEncrypted = bcrypt.hashSync(password, 10);
      const now = new Date();
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: passwordEncrypted,
        createdAt: now,
        updatedAt: now,
        origin: UserOrigins.userpassword,
      });
      await this.userRepository.save(newUser);
      const { password: password2, ...userWithoutPassword } = newUser;
      return {
        ...userWithoutPassword,
        token: this.getJwtToken({ id: userWithoutPassword.id })
      };
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async findAll(userSearchDto: UserSearchDto) {
    const { term = '', limit = this.limit, offset = 0 } = userSearchDto;
    try {
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
        .getManyAndCount();
      const count = users[1];
      if (count === 0) {
        return {
          users: [],
          numPages: 0
        }
      }
      const numPages = count < limit! ? 1 : Math.ceil(count / limit!);
      return {
        users: users[0],
        numPages: numPages
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async findOne(term: string) {
    let user;
    if (isUUID(term)) {
      user = await this.userRepository.findOne({
        where: { id: term },
        select: { password: false },
        relations: {
          films: false,
        }
      });
    }
    if (!user) {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .where(
          'UPPER(user.firstName) Like :firstName or UPPER(user.lastName) Like :lastName or UPPER(user.email) Like :email', {
          firstName: `%${term.toUpperCase()}%`,
          lastName: `%${term.toUpperCase()}%`,
          email: `%${term.toUpperCase()}%`,
        })
        // .leftJoinAndSelect('auth.films', 'authFilms')
        .getOne();
    }
    if (!user) {
      throw new NotFoundException(`Not found user with term "${term}"`);
    }
    return user;
  }

  async findOneByPhoto(imageName: string) {
    const user = await this.userRepository.findOne({
      where: { imageUrl: Like(`%${imageName}`) }
    })
    return user;
  }

  async renewToken(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const now = new Date();
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      updatedAt: now,
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
      this.commonService.handleError(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    this.userRepository.remove(user);
    if (user.imageUrl.length > 0) {
      const partsImageUrl = user.imageUrl.split('/');
      const imageToDelete = partsImageUrl[partsImageUrl.length - 1];
      const path = join(__dirname, '/../../static/profilePhotos', imageToDelete);
      if (!existsSync(path)) {
        throw new NotFoundException(`File with name ${imageToDelete} not exists`);
      }
      try {
        unlinkSync(path);
      }
      catch (error) {
        throw new BadRequestException(`Problem deleting the file "${imageToDelete}"`);
      }
    }
    return user;
  }

  async loginEmailPassword(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
        origin: UserOrigins.userpassword
      },
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

  async googleLogin(req) {
    if (!req.user) {
      throw new BadRequestException('No data for user login');
    }
    const user = await this.userRepository.findOne({
      where: {
        email: req.user.email,
        origin: UserOrigins.google,
      },
      select: { password: false },
    });
    if (user && !user.isActive) {
      throw new BadRequestException(`User "${user.email}" is not active. Talk with administrator`)
    }
    if (user) {
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      }
    }
    try {
      const newUser = this.userRepository.create({
        email: req.user.email,
        password: '',
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        imageUrl: req.user.picture,
        origin: UserOrigins.google,
      });
      await this.userRepository.save(newUser);
      return {
        ...newUser,
        token: this.getJwtToken({ id: newUser.id })
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async facebookLogin(req: any) {
    if (!req.user) {
      throw new BadRequestException('No data for user login');
    }
    const user = await this.userRepository.findOne({
      where: {
        email: req.user.email,
        origin: UserOrigins.facebook,
      },
      select: { password: false },
    });
    if (user && !user.isActive) {
      throw new BadRequestException(`User "${user.email}" is not active. Talk with administrator`)
    }
    if (user) {
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      }
    }
    try {
      const newUser = this.userRepository.create({
        email: req.user.email,
        password: '',
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        imageUrl: req.user.imageUrl,
        origin: UserOrigins.facebook,
      });
      await this.userRepository.save(newUser);
      return {
        ...newUser,
        token: this.getJwtToken({ id: newUser.id })
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token
  }
}
