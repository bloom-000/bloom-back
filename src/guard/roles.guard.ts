import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../model/common/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserService } from '../modules/user/user.service';
import { JwtHelper } from '../modules/authentication/helper/jwt.helper';
import { AuthenticationCookieService } from '../modules/authentication/authentication-cookie.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly jwtHelper: JwtHelper,
    private readonly authenticationCookieService: AuthenticationCookieService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
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

    const userRoles = await this.userService.getRolesForUser(userId);
    return requiredRoles.some((role) => userRoles?.includes(role));
  }
}
