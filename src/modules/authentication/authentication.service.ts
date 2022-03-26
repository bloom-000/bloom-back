import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
import { PasswordEncoder } from './helper/password.encoder';
import { JwtHelper } from './helper/jwt.helper';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async signIn(params: { email: string; password: string }) {
    const user = await this.userService.findByEmail(params.email);
    if (!user) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const passwordMatches = await this.passwordEncoder.matches(
      params.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    return {
      accessToken: this.jwtHelper.generateAccessToken(user.id),
    };
  }
}
