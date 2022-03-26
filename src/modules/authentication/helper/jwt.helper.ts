import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environment } from '../../../environment';
import { UserPayload } from '../../../model/common/user.payload';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(userId: number): string {
    const payload = { userId };

    return this.jwtService.sign(payload, {
      expiresIn: environment.accessTokenExpiration,
      secret: environment.accessTokenSecret,
    });
  }

  // public async validateToken(token: string): Promise<boolean> {
  //   if (!token) {
  //     throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
  //   }
  //
  //   await jwt.verify(
  //     token,
  //     environment.accessTokenSecret,
  //     async (err: jwt.VerifyErrors) => {
  //       if (err instanceof jwt.TokenExpiredError) {
  //         throw new UnauthorizedException(ExceptionMessageCode.EXPIRED_TOKEN);
  //       }
  //
  //       if (err instanceof jwt.JsonWebTokenError) {
  //         throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
  //       }
  //     },
  //   );
  //
  //   return true;
  // }

  public async getUserPayload(
    jwtToken: string,
  ): Promise<UserPayload | undefined> {
    const payload = this.jwtService.decode(jwtToken);

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload?.userId !== 'number' ||
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
