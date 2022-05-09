import {
  BadRequestException,
  CallHandler,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  Module,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtHelper } from '../modules/authentication/helper/jwt.helper';
import { UserPayload } from '../model/common/user.payload';
import { ExceptionMessageCode } from '../common/exception-message-code.enum';
import { AuthenticationCookieService } from '../modules/authentication/authentication-cookie.service';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../environment';

export const CurrentUserPayload = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as UserPayloadRequest;

    if (!request.userPayload) {
      throw new BadRequestException(
        ExceptionMessageCode.MISSING_CURRENT_USER_PAYLOAD,
      );
    }

    return request?.userPayload;
  },
);

export interface UserPayloadRequest extends Request {
  userPayload: UserPayload | undefined;
}

@Injectable()
export class CurrentUserPayloadInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly authenticationCookieService: AuthenticationCookieService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    let jwtToken = authorizationHeader?.slice('Bearer '.length);
    if (!jwtToken) {
      jwtToken = this.authenticationCookieService.getAccessToken(request);
    }

    if (jwtToken) {
      request.userPayload = await this.jwtHelper.getUserPayload(jwtToken);
    }

    return next.handle();
  }
}

@Module({
  imports: [
    JwtModule.register({
      secret: environment.accessTokenSecret,
      signOptions: { expiresIn: environment.accessTokenExpiration },
    }),
  ],
  providers: [AuthenticationCookieService, JwtHelper],
  exports: [JwtHelper, AuthenticationCookieService],
})
export class CurrentUserPayloadInterceptorModule {}
