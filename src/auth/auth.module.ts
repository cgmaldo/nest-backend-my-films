import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { Film } from 'src/film/entities/film.entity';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy],
  imports: [
    ConfigModule,
    CommonModule,
    TypeOrmModule.forFeature([User]),
    // Configuración sin necesidad de un módulo asíncrono eligiendo la estrategia JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET') || '',
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    }),
    TypeOrmModule.forFeature([User, Film])
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule, AuthService]
})
export class AuthModule { }
