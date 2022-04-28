import {
  ConflictException,
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
import {
  SignInParams,
  SignUpWithTokenParams,
} from './authentication.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly authenticationCookieService: AuthenticationCookieService,
  ) {}

  async signIn(params: SignInParams, request: Request, response: Response) {
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
    response.send();
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
    response.send();
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
    response.send();
  }

  async validateAuthentication(request: Request) {
    const refreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (!refreshToken) {
      throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
    }

    await this.jwtHelper.validateRefreshToken(refreshToken);
  }

  async signUpWithToken(params: SignUpWithTokenParams): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (await this.userService.userExistsByEmail(params.email)) {
      throw new ConflictException(
        ExceptionMessageCode.USER_EMAIL_ALREADY_EXISTS,
      );
    }

    const hashedPassword = await this.passwordEncoder.encode(params.password);
    const user = await this.userService.createUser({
      ...params,
      password: hashedPassword,
      refreshTokens: [],
    });

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });
    await this.userService.addRefreshTokenTo(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signInWithToken(
    params: SignInParams,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });
    await this.userService.addRefreshTokenTo(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
