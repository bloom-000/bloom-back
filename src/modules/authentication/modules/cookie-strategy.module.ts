import { Module } from '@nestjs/common';
import { CookieJwtStrategy } from '../strategy/cookie-jwt.strategy';
import { AuthenticationCookieService } from '../authentication-cookie.service';

@Module({
  providers: [CookieJwtStrategy, AuthenticationCookieService],
  exports: [CookieJwtStrategy, AuthenticationCookieService],
})
export class CookieStrategyModule {}
