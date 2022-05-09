import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environment } from '../../../environment';
import { JwtPayload, UserPayload } from '../../../model/common/user.payload';
import { ExceptionMessageCode } from '../../../common/exception-message-code.enum';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  generateAuthenticationTokens(payload: JwtPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: environment.accessTokenExpiration,
        secret: environment.accessTokenSecret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: environment.refreshTokenExpiration,
        secret: environment.refreshTokenSecret,
      }),
    };
  }

  async isRefreshTokenValid(token: string): Promise<boolean> {
    if (!token) {
      return false;
    }
    try {
      await this.jwtService.verifyAsync(token, {
        secret: environment.refreshTokenSecret,
        ignoreExpiration: false,
      });
      return true;
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    if (!token) {
      throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
    }

    await jwt.verify(
      token,
      environment.refreshTokenSecret,
      async (err: jwt.VerifyErrors) => {
        if (err instanceof jwt.TokenExpiredError) {
          throw new UnauthorizedException(ExceptionMessageCode.EXPIRED_TOKEN);
        }

        if (err instanceof jwt.JsonWebTokenError) {
          throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
        }
      },
    );

    return true;
  }

  async getUserPayload(jwtToken: string): Promise<UserPayload | undefined> {
    const payload = this.jwtService.decode(jwtToken);

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload?.userId !== 'string' ||
      typeof payload?.iat !== 'number' ||
      typeof payload?.exp !== 'number'
    ) {
      return undefined;
    }

    return {
      userId: payload.userId,
      issuedAt: payload.iat,
      expirationTime: payload.exp,
    };
  }
}
