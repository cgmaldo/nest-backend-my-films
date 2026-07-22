import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res, Delete, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { OwnerImgUrlOrAdminGuard } from 'src/auth/guards/owner-imgurl-or-admin.guard';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@ApiTags('Files - Get and Upload')
@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
  ) { }

  @ApiResponse({ status: 200, description: 'Updload profile photo for user' })
  @ApiResponse({ status: 400, description: 'Not found file' })
  @ApiResponse({ status: 400, description: 'Not found user' })
  @ApiBearerAuth('bearer-token')
  @ApiParam({
    type: File,
    name: 'file',
    description: 'File for upload the profile photo of authenticated user',
    required: true,
  })
  @ApiParam({
    type: User,
    name: 'user',
    description: 'Data about the user who wants to upload their profile photo. Obtained using custom decorator GetUser',
    required: true,
  })
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
  async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File, @GetUser() user: User) {
    return this.fileService.uploadProfilePhoto(file, user);
  }

  @ApiResponse({ status: 200, description: 'Profile photo for user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found found photo' })
  @ApiParam({
    type: String,
    name: 'imageName',
    description: 'Name of user\`s profile photo',
    required: true,
  })
  @ApiBearerAuth('bearer-token')
  @Get('profilePhoto/:imageName')
  @UseGuards(AuthGuard())
  getProfilePhoto(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.fileService.getProfilePhoto(imageName);
    res.sendFile(path);
  }

  @ApiResponse({ status: 200, description: 'Profile photo for user deleted. Response name of photo' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found found photo' })
  @ApiParam({
    type: String,
    name: 'imageName',
    description: 'Name of user\`s profile photo',
    required: true,
  })
  @ApiBearerAuth('bearer-token')
  @Delete('profilePhoto/:imageName')
  @UseGuards(AuthGuard(), OwnerImgUrlOrAdminGuard)
  deletetProfilePhoto(@Param('imageName') imageName: string, @GetUser() user: User) {
    return this.fileService.deleteProfilePhoto(imageName, user);
  }
}
