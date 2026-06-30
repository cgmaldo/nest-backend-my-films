import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, Query, ParseUUIDPipe } from '@nestjs/common';
import { FilmService } from './film.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDto } from '../common/dtos/pagination-dto';
import { TypeFilm } from './interfaces/typefilm.interface';

@Controller('film')
export class FilmController {
  constructor(
    private readonly filmService: FilmService,
  ) { }

  @Post()
  @Auth()
  create(@Body() createFilmDto: CreateFilmDto, @GetUser() user: User) {
    return this.filmService.create(createFilmDto, user);
  }

  @Get('allBy/:typeFilm')
  @Auth()
  findAll(@Param('typeFilm') typeFilm: TypeFilm, @Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.filmService.findAll(typeFilm, paginationDto, user);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.filmService.findOne(id, user);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFilmDto: UpdateFilmDto, @GetUser() user: User) {
    return this.filmService.update(id, updateFilmDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.filmService.remove(id, user);
  }
}
