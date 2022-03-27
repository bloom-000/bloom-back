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
import { AuthenticationPayloadDto } from '../../model/dto/authentication/authentication-payload.dto';
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
  ): Promise<AuthenticationPayloadDto> {
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

    const oldRefreshToken = request.cookies?.refreshToken;
    if (oldRefreshToken) {
      await this.userService.removeRefreshTokenFor(user.id, oldRefreshToken);
      this.authenticationCookieService.clearRefreshToken(response);
    }
    const newRefreshToken = this.jwtHelper.generateRefreshToken({
      userId: user.id,
    });
    await this.userService.addRefreshTokenTo(user.id, newRefreshToken);
    this.authenticationCookieService.setRefreshTokenCookie(
      response,
      newRefreshToken,
    );

    return {
      accessToken: this.jwtHelper.generateAccessToken({ userId: user.id }),
    };
  }

  async refreshToken(
    request: Request,
    response: Response,
  ): Promise<AuthenticationPayloadDto> {
    const refreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (!refreshToken) {
      throw new UnauthorizedException(
        ExceptionMessageCode.MISSING_REFRESH_TOKEN,
      );
    }

    this.authenticationCookieService.clearRefreshToken(response);

    const user = await this.userService.findByRefreshToken(refreshToken);
    if (!user) {
      const decodedPayload = await this.jwtHelper.getUserPayload(refreshToken);
      await this.userService.clearRefreshTokensForUser(decodedPayload.userId);
      throw new ForbiddenException(ExceptionMessageCode.REFRESH_TOKEN_REUSE);
    }

    if (!(await this.jwtHelper.isRefreshTokenValid(refreshToken))) {
      await this.userService.removeRefreshTokenFor(user.id, refreshToken);
      throw new ForbiddenException(ExceptionMessageCode.INVALID_TOKEN);
    }

    const newRefreshToken = this.jwtHelper.generateRefreshToken({
      userId: user.id,
    });
    await this.userService.addRefreshTokenTo(user.id, newRefreshToken);
    this.authenticationCookieService.setRefreshTokenCookie(
      response,
      newRefreshToken,
    );

    return {
      accessToken: this.jwtHelper.generateAccessToken({ userId: user.id }),
    };
  }

  async logout(request: Request, response: Response): Promise<void> {
    const refreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (!refreshToken) {
      return;
    }

    this.authenticationCookieService.clearRefreshToken(response);
    const user = await this.userService.findByRefreshToken(refreshToken);
    if (!user) {
      return;
    }

    await this.userService.removeRefreshTokenFor(user.id, refreshToken);
  }
}
