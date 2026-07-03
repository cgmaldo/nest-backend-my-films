import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSearchDto } from 'src/common/dtos/user-search-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { MyselfOrAdminGuard } from './guards/myself-or-admin.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('')
  @Auth(ValidRoles.admin)
  findAll(@Query() userSearchDto: UserSearchDto) {
    return this.authService.findAll(userSearchDto);
  }

  @Get('login')
  loginEmailPassword(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginEmailPassword(loginUserDto);
  }

  @Get('renewToken')
  @UseGuards(AuthGuard())
  renewToken(@GetUser() user: User) {
    return this.authService.renewToken(user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  // @Get("facebook/callback")
  @Get("facebook")
  @UseGuards(AuthGuard("facebook"))
  facebookLoginRedirect(@Req() req: Request) {
    return this.authService.facebookLogin(req);
  }

  @Get(':term')
  @UseGuards(AuthGuard(), MyselfOrAdminGuard)
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), MyselfOrAdminGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
