import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { User } from 'src/auth/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FileService {

  constructor(
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) { }

  async uploadProfilePhoto(file: Express.Multer.File, user: User) {
    if (!file) {
      throw new BadRequestException('File is not valid');
    }
    if (!user) {
      throw new BadRequestException('User not valid');
    }
    if (user.imageUrl.length > 0) {
      const fileNameImage = this.commonService.fileNameFromUrl(user.imageUrl);
      const path = join(__dirname, '/../../static/profilePhotos', fileNameImage);
      if (existsSync(path)) {
        await this.deleteProfilePhoto(fileNameImage, user);
      }
    }
    const imageUrl = `${this.configService.get<string>('HOST_API')}/file/profilePhoto/${file.filename}`;
    const { id, password, ...restUser } = user;
    try {
      await this.authService.update(id, { ...restUser, imageUrl })
      return imageUrl;
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  getProfilePhoto(imageName: string) {
    const path = join(__dirname, '/../../static/profilePhotos', imageName);
    this.existsPath(path);
    return path;
  }

  async deleteProfilePhoto(imageName: string, user: User) {
    const path = join(__dirname, '/../../static/profilePhotos', imageName);
    this.existsPath(path);
    try {
      if (imageName.includes(user.id)) {
        const { id, password, ...restUser } = user;
        await this.authService.update(id, { ...restUser, imageUrl: '' });
      } else {
        const userOwnerPhoto = await this.authService.findOneByPhoto(imageName)
        if (!userOwnerPhoto) {
          throw new NotFoundException(`File with name ${imageName} not exists`);
        }
        const { id, password, ...restUser } = userOwnerPhoto!
        await this.authService.update(id, { ...restUser, imageUrl: '' });
      }
      unlinkSync(path);
      return imageName;
    }
    catch (error) {
      this.commonService.handleError(error);
    }
  }

  private existsPath(path: string) {
    const imageName = this.commonService.fileNameFromUrl(path);
    if (!existsSync(path)) {
      throw new NotFoundException(`File with name ${imageName} not exists`);
    }
  }

}
