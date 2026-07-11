import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseGuards, Req } from '@nestjs/common';
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
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auths')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @ApiBody({
    description: 'Data for create',
    type: CreateUserDto,
  })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({ status: 200, description: 'List of users and numPages' })
  @ApiResponse({ status: 403, description: 'Access forbidden' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @ApiBearerAuth('bearer-token')
  @Get('')
  @Auth(ValidRoles.admin)
  findAll(@Query() userSearchDto: UserSearchDto) {
    return this.authService.findAll(userSearchDto);
  }

  @ApiResponse({ status: 200, description: 'Data user without password and access token' })
  @ApiResponse({ status: 401, description: 'Email/Password are not valid' })
  @Get('login')
  loginEmailPassword(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginEmailPassword(loginUserDto);
  }

  @ApiResponse({ status: 200, description: 'Data user without password and access token' })
  @ApiResponse({ status: 400, description: 'No data for user login' })
  @ApiResponse({ status: 400, description: 'User "user.email" is not active. Talk with administrator' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @ApiResponse({ status: 200, description: 'Data user without password and access token' })
  @ApiResponse({ status: 400, description: 'No data for user login' })
  @ApiResponse({ status: 400, description: 'User "user.email" is not active. Talk with administrator' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @Get("facebook")
  @UseGuards(AuthGuard("facebook"))
  facebookLoginRedirect(@Req() req: Request) {
    return this.authService.facebookLogin(req);
  }

  @ApiResponse({ status: 200, description: 'Data user without password and access token' })
  @ApiResponse({ status: 401, description: 'Unauthorized missing token' })
  @ApiBearerAuth('bearer-token')
  @Get('renewToken')
  @UseGuards(AuthGuard())
  renewToken(@GetUser() user: User) {
    return this.authService.renewToken(user);
  }

  @ApiResponse({ status: 200, description: 'Data user without password' })
  @ApiResponse({ status: 401, description: 'Unauthorized missing token' })
  @ApiResponse({ status: 404, description: 'Not found user with term' })
  @ApiBearerAuth('bearer-token')
  @ApiParam({
    example: '6c193d38-6380-4062-9638-e604a838411c',
    type: 'string',
    name: 'term',
    description: 'Search term for id,firstname, lastname or email',
    required: true,
  })
  @Get(':term')
  @UseGuards(AuthGuard(), MyselfOrAdminGuard)
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @ApiResponse({ status: 200, description: 'Data user without password' })
  @ApiResponse({ status: 404, description: 'Not found user with id' })
  @ApiResponse({ status: 500, description: 'Unexpected error check server logs' })
  @ApiBearerAuth('bearer-token')
  @ApiBody({
    description: 'Data for update',
    type: UpdateUserDto,
  })
  @ApiParam({
    example: '6c193d38-6380-4062-9638-e604a838411c',
    type: 'string',
    name: 'id',
    description: 'Search term for id',
    required: true,
  })
  @Patch(':id')
  @UseGuards(AuthGuard(), MyselfOrAdminGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @ApiResponse({ status: 200, description: 'Data user without password' })
  @ApiResponse({ status: 400, description: 'Problem deleting the file' })
  @ApiResponse({ status: 401, description: 'Unauthorized missing token' })
  @ApiResponse({ status: 404, description: 'Not found user with term' })
  @ApiBearerAuth('bearer-token')
  @ApiParam({
    example: '6c193d38-6380-4062-9638-e604a838411c',
    type: 'string',
    name: 'id',
    description: 'Search term for id',
    required: true,
  })
  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
