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

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async signIn(params: {
    email: string;
    password: string;
  }): Promise<AuthenticationPayloadDto> {
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
      accessToken: this.jwtHelper.generateAccessToken({ userId: user.id }),
      refreshToken: this.jwtHelper.generateRefreshToken({ userId: user.id }),
    };
  }

  async refreshToken(
    request: Request,
    response: Response,
  ): Promise<AuthenticationPayloadDto> {
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException(
        ExceptionMessageCode.MISSING_REFRESH_TOKEN,
      );
    }

    response.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

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

    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(new Date().getTime() + 86409000), // never
    });

    return {
      accessToken: this.jwtHelper.generateAccessToken({ userId: user.id }),
      refreshToken: newRefreshToken,
    };
  }
}
