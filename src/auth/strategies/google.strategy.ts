import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { ConfigService } from '@nestjs/config';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            // clientID: '340538535453-olf8othfgrteae2ksho4hi01ts1pt1bk.apps.googleusercontent.com',
            // clientSecret: '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',
            // callbackURL: `http://localhost:3000/auth/google`,
            // scope: ['email', 'profile'],
            clientID: configService.get('CLIENTID'),
            clientSecret: configService.get('CLIENTSECRET'),
            callbackURL: configService.get('CALLBACKURL'),
            scope: ['email', 'profile'],
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, user);
    }
}