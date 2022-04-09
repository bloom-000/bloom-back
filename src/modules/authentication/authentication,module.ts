import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { PasswordEncoder } from './helper/password.encoder';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { BearerHeaderJwtStrategy } from './bearer-header-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../../environment';
import { JwtHelper } from './helper/jwt.helper';
import { AuthenticationController } from './autnentication.controller';
import { AuthenticationCookieService } from './authentication-cookie.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: environment.accessTokenSecret,
      signOptions: { expiresIn: environment.accessTokenExpiration },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    PasswordEncoder,
    BearerHeaderJwtStrategy,
    JwtHelper,
    AuthenticationCookieService,
  ],
  exports: [JwtHelper, AuthenticationCookieService],
})
export class AuthenticationModule {}
