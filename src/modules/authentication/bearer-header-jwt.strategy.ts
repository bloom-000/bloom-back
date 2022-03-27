import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { environment } from '../../environment';

@Injectable()
export class BearerHeaderJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.accessTokenSecret,
    });
  }

  // noinspection JSUnusedGlobalSymbols
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
