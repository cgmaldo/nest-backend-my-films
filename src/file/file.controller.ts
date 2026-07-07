import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, ParseUUIDPipe, NotFoundException, Res, Delete, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { MyselfOrAdminGuard } from 'src/auth/guards/myself-or-admin.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { OwnerOrAdminGuard } from 'src/auth/guards/owner-or-admin.guard';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) { }

  @Post('profilePhoto')
  // file es el nombre de la propiedad del body de la petición
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 2000000 },
    storage: diskStorage({
      destination: './static/profilePhotos',
      filename: fileNamer,
    }),
  }))
  @UseGuards(AuthGuard())
  async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not valid');
    }
    const secureUrl = `${this.configService.get<string>('HOST_API')}/file/profilePhoto/${file.filename}`;
    return secureUrl;
  }

  @Get('profilePhoto/:imageName')
  getProfilePhoto(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.fileService.getProfilePhoto(imageName);
    res.sendFile(path);
  }

  @Delete('profilePhoto/:imageName')
  @UseGuards(AuthGuard(), OwnerOrAdminGuard)
  deletetProfilePhoto(@Param('imageName') imageName: string) {
    return this.fileService.deleteProfilePhoto(imageName);
  }
}
