import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    ConfigModule,
    AuthModule,
  ]
})
export class FileModule { }
