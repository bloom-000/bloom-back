import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { CookieOptions } from 'express-serve-static-core';

@Injectable()
export class AuthenticationCookieService {
  private static readonly KEY_REFRESH_TOKEN = 'refresh_token';
  private static readonly KEY_ACCESS_TOKEN = 'access_token';

  clearAuthenticationTokenCookies(response: Response) {
    response.clearCookie(AuthenticationCookieService.KEY_REFRESH_TOKEN, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    response.clearCookie(AuthenticationCookieService.KEY_ACCESS_TOKEN, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  }

  persistAuthenticationTokenCookies(
    response: Response,
    refreshToken: string,
    accessToken: string,
  ) {
    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(new Date().getTime() + 86409000), // never
    };

    response.cookie(
      AuthenticationCookieService.KEY_REFRESH_TOKEN,
      refreshToken,
      options,
    );
    response.cookie(
      AuthenticationCookieService.KEY_ACCESS_TOKEN,
      accessToken,
      options,
    );
  }

  getRefreshToken(request: Request): string | undefined {
    if (!request || !request.cookies) {
      return undefined;
    }
    return request.cookies[AuthenticationCookieService.KEY_REFRESH_TOKEN];
  }

  getAccessToken(request: Request): string | undefined {
    if (!request || !request.cookies) {
      return undefined;
    }
    return request.cookies[AuthenticationCookieService.KEY_REFRESH_TOKEN];
  }
}
