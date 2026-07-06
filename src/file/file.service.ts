import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { ChildEntity } from 'typeorm';

@Injectable()
export class FileService {
  getProfilePhoto(imageName: string) {
    const path = join(__dirname, '/../../static/profilePhotos', imageName);
    if (!existsSync(path)) {
      throw new NotFoundException(`File with name ${imageName} not exists`);
    }
    return path;
  }
}
