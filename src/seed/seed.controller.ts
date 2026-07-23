import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { TypeFilm } from 'src/film/interfaces/typefilm.interface';
import { ValidTypeFilmPipe } from 'src/common/pipes/validTypeFilm.pipe';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';

@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService
  ) { }

  @ApiResponse({ status: 200, description: 'Seed completed' })
  @ApiResponse({ status: 400, description: 'Bad request wrong type film value ' })
  @ApiResponse({ status: 403, description: 'Unauthorized only for admin' })
  @ApiResponse({ status: 404, description: 'Not found user' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @ApiBearerAuth('bearer-token')
  @Get(':typeFilm/:userId')
  @ApiParam({
    name: 'typefilm',
    type: 'string',
    enum: TypeFilm,
    description: 'Kind of film',
    required: true,
  })
  @ApiParam({
    type: UUID,
    name: 'userId',
    description: 'User id',
    required: true,
  })
  @Auth(ValidRoles.admin)
  seed(@Param('userId', ParseUUIDPipe) userId: string, @Param('typeFilm', ValidTypeFilmPipe) typeFilm: TypeFilm) {
    return this.seedService.importBackup(userId, typeFilm);
  }
}
