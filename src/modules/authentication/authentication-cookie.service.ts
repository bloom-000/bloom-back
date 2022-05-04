import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { CookieOptions } from 'express-serve-static-core';
import { DurationConstants } from '../../common/duration.constants';

@Injectable()
export class AuthenticationCookieService {
  private static readonly KEY_REFRESH_TOKEN = 'refresh_token';
  private static readonly KEY_ACCESS_TOKEN = 'access_token';

  clearAuthenticationTokenCookies(response: Response) {
    response.clearCookie(AuthenticationCookieService.KEY_REFRESH_TOKEN, {
      httpOnly: true,
    });
    response.clearCookie(AuthenticationCookieService.KEY_ACCESS_TOKEN, {
      httpOnly: true,
    });
  }

  persistAuthenticationTokenCookies(
    response: Response,
    refreshToken: string,
    accessToken: string,
  ) {
    const options: CookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + DurationConstants.MILLIS_IN_YEAR),
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
    return request.cookies[AuthenticationCookieService.KEY_ACCESS_TOKEN];
  }
}
