import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.get('FACEBOOK_APP_ID') as string,
            clientSecret: configService.get('FACEBOOK_APP_SECRET') as string,
            callbackURL: configService.get('FACEBOOK_CALLBACKURL') as string,
            scope: 'email',
            profileFields: ['emails', 'name'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const { name, emails } = profile;
        // emails is an array; shift() or [0] gets the primary email
        const user = {
            firstName: name.givenName,
            lastName: name.familyName,
            email: emails[0].value, // Extract email string
            provider: 'facebook',
            providerId: profile.id,
        };
        try {
            return done(null, user) // whatever should get to your controller
        } catch (e) {
            return done('error', null)
        }
    }
}