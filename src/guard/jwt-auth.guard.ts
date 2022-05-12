import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NO_AUTH_KEY } from '../decorator/no-auth.decorator';
import { AuthenticationCookieService } from '../modules/authentication/authentication-cookie.service';
import { ExceptionMessageCode } from '../common/exception-message-code.enum';
import { JwtHelper } from '../modules/authentication/helper/jwt.helper';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authenticationCookieService: AuthenticationCookieService,
    private jwtHelper: JwtHelper,
  ) {}

  canActivate(context: ExecutionContext) {
    const noAuth = this.reflector.getAllAndOverride<boolean>(NO_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (noAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let accessToken = this.authenticationCookieService.getAccessToken(request);
    if (!accessToken) {
      const authorizationHeader =
        request.headers['authorization'] || request.headers['Authorization'];
      if (!authorizationHeader) {
        return false;
      }

      accessToken = authorizationHeader.slice('Bearer '.length);
    }

    if (!accessToken) {
      throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
    }

    return this.jwtHelper.validateAccessToken(accessToken);
  }
}
