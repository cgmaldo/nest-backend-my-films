import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { TypeFilm } from 'src/film/interfaces/typefilm.interface';
import { ValidTypeFilmPipe } from 'src/common/pipes/validTypeFilm.pipe';

@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService
  ) { }

  @Get(':typeFilm/:userId')
  @Auth(ValidRoles.admin)
  seed(@Param('userId', ParseUUIDPipe) userId: string, @Param('typeFilm', ValidTypeFilmPipe) typeFilm: TypeFilm) {
    return this.seedService.importBackup(userId, typeFilm);
  }
}
