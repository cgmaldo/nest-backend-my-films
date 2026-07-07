import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  getProfilePhoto(imageName: string) {
    const path = join(__dirname, '/../../static/profilePhotos', imageName);
    if (!existsSync(path)) {
      throw new NotFoundException(`File with name ${imageName} not exists`);
    }
    return path;
  }

  deleteProfilePhoto(imageName: string) {
    const path = join(__dirname, '/../../static/profilePhotos', imageName);
    if (!existsSync(path)) {
      throw new NotFoundException(`File with name ${imageName} not exists`);
    }
    try {
      unlinkSync(path);
      return imageName;
    }
    catch (error) {
      throw new BadRequestException(`Problem deleting the file "${imageName}"`);
    }
  }
}
