import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { PasswordEncoder } from './helper/password.encoder';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtHelper } from './helper/jwt.helper';
import { AuthenticationController } from './autnentication.controller';
import { AuthenticationCookieService } from './authentication-cookie.service';
import { RandomGenerator } from '../../common/util/random.generator';
import { RecoverPasswordCacheModule } from './recover-password-cache/recover-password-cache.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    RecoverPasswordCacheModule,
    JwtModule.register({}),
    EmailModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    PasswordEncoder,
    JwtHelper,
    AuthenticationCookieService,
    RandomGenerator,
  ],
  exports: [JwtHelper, AuthenticationCookieService],
})
export class AuthenticationModule {}
