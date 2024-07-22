import { config } from '@/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { emailSchema, nameSchema } from '@repo/global';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import z from 'zod';

export interface GoogleUserPayload {
  provider: 'google';
  providerId: string;
  email: string;
  name: string;
  picture: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const payload: GoogleUserPayload = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    const googleUserSchema = z.object({
      provider: z.enum(['google']),
      providerId: z.string(),
      email: emailSchema,
      name: nameSchema,
      picture: z.string(),
    });

    const { error, data: user } = googleUserSchema.safeParse(payload);

    done(error, user);
  }
}
