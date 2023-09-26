import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { AuthProvider } from 'src/model/users/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { id, name, emails } = profile;

    const user = await this.authService.validateOauthUser(
      id,
      AuthProvider.GOOGLE,
    );

    if (!user) {
      const newUser = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        provider: AuthProvider.GOOGLE,
        providerId: id,
      };
      
      return await this.authService.regiserOauth(newUser);

    }


    // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    return {
      provider: 'google',
      providerId: id,
      firsName: name.givenName,
      lastName: name.familyName,
      email: emails[0].value,
    };

    
  }
}
