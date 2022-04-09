import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { environment } from '../../environment';
import { AuthenticationCookieService } from './authentication-cookie.service';

@Injectable()
export class CookieJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authenticationCookieService: AuthenticationCookieService,
  ) {
    super({
      jwtFromRequest: (req) =>
        this.authenticationCookieService.getAccessToken(req),
      ignoreExpiration: false,
      secretOrKey: environment.accessTokenSecret,
    });
  }

  // noinspection JSUnusedGlobalSymbols
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
