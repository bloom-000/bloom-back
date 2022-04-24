import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KEY_PERMISSIONS } from '../decorator/permissions.decorator';
import { UserService } from '../modules/user/user.service';
import { JwtHelper } from '../modules/authentication/helper/jwt.helper';
import { AuthenticationCookieService } from '../modules/authentication/authentication-cookie.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly jwtHelper: JwtHelper,
    private readonly authenticationCookieService: AuthenticationCookieService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      KEY_PERMISSIONS,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    let jwtToken = authorizationHeader?.slice('Bearer '.length);
    if (!jwtToken) {
      jwtToken = this.authenticationCookieService.getAccessToken(request);
      if (!jwtToken) {
        return false;
      }
    }

    const { userId } = await this.jwtHelper.getUserPayload(jwtToken);
    if (!userId) {
      return false;
    }

    const userPermissions = (
      await this.userService.getUserPermissions(userId)
    ).map((e) => e.permission);

    return requiredPermissions.every((permission) =>
      userPermissions?.includes(permission),
    );
  }
}
