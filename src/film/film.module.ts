import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FilmController],
  providers: [FilmService],
  imports: [
    ConfigModule,
    AuthModule,
  ]
})
export class FilmModule { }
