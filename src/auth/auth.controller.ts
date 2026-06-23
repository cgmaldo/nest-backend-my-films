import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dtos/pagination-dto';
import { UserSearchDto } from 'src/common/dtos/user-search-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('')
  findAll(@Query() userSearchDto: UserSearchDto) {
    return this.authService.findAll(userSearchDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
