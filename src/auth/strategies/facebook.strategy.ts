import { Injectable, NotFoundException } from "@nestjs/common";
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
            profileFields: ['emails', 'name', 'photos'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const { name, emails = null, photos = null } = profile;

        if (!emails) {
            return done('error', null)
        }
        const email = emails[0].value;
        if (!photos) {
            return done('error', null)
        }
        const imageUrl = photos[0].value
        const user = {
            firstName: name.givenName,
            lastName: name.familyName,
            email,
            imageUrl,
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