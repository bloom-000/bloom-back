import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
export class AuthenticationCookieService {
  private static readonly KEY_REFRESH_TOKEN = 'refresh_token';

  clearRefreshToken(response: Response) {
    response.clearCookie(AuthenticationCookieService.KEY_REFRESH_TOKEN, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  }

  setRefreshTokenCookie(response: Response, refreshToken: string) {
    response.cookie(
      AuthenticationCookieService.KEY_REFRESH_TOKEN,
      refreshToken,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(new Date().getTime() + 86409000), // never
      },
    );
  }

  getRefreshToken(request: Request): string | undefined {
    return request.cookies[AuthenticationCookieService.KEY_REFRESH_TOKEN];
  }
}
