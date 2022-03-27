import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
import { PasswordEncoder } from './helper/password.encoder';
import { JwtHelper } from './helper/jwt.helper';
import { Request, Response } from 'express';
import { AuthenticationCookieService } from './authentication-cookie.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly authenticationCookieService: AuthenticationCookieService,
  ) {}

  async signIn(
    email: string,
    password: string,
    request: Request,
    response: Response,
  ) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const passwordMatches = await this.passwordEncoder.matches(
      password,
      user.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const oldRefreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (oldRefreshToken) {
      await this.userService.removeRefreshTokenFor(user.id, oldRefreshToken);
      this.authenticationCookieService.clearAuthenticationTokenCookies(
        response,
      );
    }
    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });
    await this.userService.addRefreshTokenTo(user.id, refreshToken);
    this.authenticationCookieService.persistAuthenticationTokenCookies(
      response,
      refreshToken,
      accessToken,
    );
  }

  async refreshToken(request: Request, response: Response) {
    const oldRefreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (!oldRefreshToken) {
      throw new UnauthorizedException(
        ExceptionMessageCode.MISSING_REFRESH_TOKEN,
      );
    }

    this.authenticationCookieService.clearAuthenticationTokenCookies(response);

    const user = await this.userService.findByRefreshToken(oldRefreshToken);
    if (!user) {
      const decodedPayload = await this.jwtHelper.getUserPayload(
        oldRefreshToken,
      );
      await this.userService.clearRefreshTokensForUser(decodedPayload.userId);
      throw new ForbiddenException(ExceptionMessageCode.REFRESH_TOKEN_REUSE);
    }

    if (!(await this.jwtHelper.isRefreshTokenValid(oldRefreshToken))) {
      await this.userService.removeRefreshTokenFor(user.id, oldRefreshToken);
      throw new ForbiddenException(ExceptionMessageCode.INVALID_TOKEN);
    }

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({ userId: user.id });
    await this.userService.addRefreshTokenTo(user.id, refreshToken);
    this.authenticationCookieService.persistAuthenticationTokenCookies(
      response,
      refreshToken,
      accessToken,
    );
  }

  async logout(request: Request, response: Response): Promise<void> {
    const oldRefreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (!oldRefreshToken) {
      return;
    }

    this.authenticationCookieService.clearAuthenticationTokenCookies(response);
    const user = await this.userService.findByRefreshToken(oldRefreshToken);
    if (!user) {
      return;
    }

    await this.userService.removeRefreshTokenFor(user.id, oldRefreshToken);
  }

  async validateAuthentication(request: Request) {
    const refreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (!refreshToken) {
      throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
    }

    await this.jwtHelper.validateToken(refreshToken);
  }
}
