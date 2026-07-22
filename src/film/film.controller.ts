import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { FilmService } from './film.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TypeFilm } from './interfaces/typefilm.interface';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';
import { FilmSearchDto } from 'src/common/dtos/film-search-dto';
import { ValidTypeFilmPipe } from 'src/common/pipes/validTypeFilm.pipe';
import { AuthGuard } from '@nestjs/passport';
import { YourselfOrAdminGuard } from './guards/yourself-or-admin.guard';

@ApiTags('Films')
@Controller('film')
export class FilmController {
  constructor(
    private readonly filmService: FilmService,
  ) { }

  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @ApiBearerAuth('bearer-token')
  @ApiBody({
    description: 'Data for create film',
    type: CreateFilmDto,
  })
  @ApiParam({
    type: User,
    name: 'user',
    description: 'User data who create film obtained using custom decorator GetUser',
    required: true,
  })
  @Post()
  @Auth()
  create(@Body() createFilmDto: CreateFilmDto, @GetUser() user: User) {
    return this.filmService.create(createFilmDto, user);
  }

  @ApiResponse({ status: 200, description: 'User\'s films of a particular type, paginated and counted' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @ApiBearerAuth('bearer-token')
  @ApiParam({
    type: User,
    name: 'user',
    description: 'User data owner of films obtained using custom decorator GetUser',
    required: true,
  })
  @Get('allBy/:typeFilm')
  @Auth()
  findAll(@Param('typeFilm', ValidTypeFilmPipe) typeFilm: TypeFilm, @Query() filmSearchDto: FilmSearchDto, @GetUser() user: User) {
    return this.filmService.findAll(typeFilm, filmSearchDto, user);
  }

  @ApiResponse({ status: 200, description: 'User\'s film without user information' })
  @ApiResponse({ status: 404, description: 'Not found film' })
  @ApiParam({
    type: UUID,
    name: 'id',
    description: 'Film ID',
    required: true,
  })
  @ApiParam({
    type: User,
    name: 'user',
    description: 'User data owner of films obtained using custom decorator GetUser',
    required: true,
  })
  @ApiBearerAuth('bearer-token')
  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.filmService.findOne(id, user);
  }

  @ApiResponse({ status: 200, description: 'User\'s film with type and date upodated' })
  @ApiResponse({ status: 404, description: 'Not found user' })
  @ApiResponse({ status: 404, description: 'Not found film' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @ApiParam({
    type: UUID,
    name: 'id',
    description: 'Film ID',
    required: true,
  })
  @ApiParam({
    type: User,
    name: 'user',
    description: 'User data owner of films obtained using custom decorator GetUser',
    required: true,
  })
  @ApiBody({
    description: 'Data for update type film',
    type: UpdateFilmDto,
  })
  @ApiBearerAuth('bearer-token')
  @Patch(':id')
  @Auth()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFilmDto: UpdateFilmDto, @GetUser() user: User) {
    return this.filmService.update(id, updateFilmDto, user);
  }

  @ApiResponse({ status: 200, description: 'Data of film deleted' })
  @ApiResponse({ status: 404, description: 'Not found user' })
  @ApiResponse({ status: 404, description: 'Not found film' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @ApiParam({
    type: UUID,
    name: 'id',
    description: 'Film ID',
    required: true,
  })
  @ApiParam({
    type: User,
    name: 'user',
    description: 'User data owner of films obtained using custom decorator GetUser',
    required: true,
  })
  @ApiBearerAuth('bearer-token')
  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.filmService.remove(id, user);
  }

  @Delete(':typeFilm/:id')
  @UseGuards(AuthGuard(), YourselfOrAdminGuard)
  removeAllByTypeFilm(@Param('typeFilm', ValidTypeFilmPipe) typeFilm: TypeFilm, @Param('id', ParseUUIDPipe) id: string) {
    return this.filmService.removeType(id, typeFilm);
  }

  @Delete('all/:id')
  @UseGuards(AuthGuard(), YourselfOrAdminGuard)
  removeAll(@Param('id', ParseUUIDPipe) id: string) {
    return this.filmService.removeAll(id);
  }
}
