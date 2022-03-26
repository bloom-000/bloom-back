import {
  BadRequestException,
  CallHandler,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtHelper } from '../modules/authentication/helper/jwt.helper';
import { UserPayload } from '../model/common/user.payload';
import { ExceptionMessageCode } from '../exception/exception-message-codes.enum';

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
  constructor(private readonly jwtHelper: JwtHelper) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<UserPayloadRequest>();
    const authorizationHeader =
      request.headers['authorization'] || request.headers['Authorization'];
    const jwtToken = authorizationHeader.slice('Bearer '.length);

    if (jwtToken) {
      request.userPayload = await this.jwtHelper.getUserPayload(jwtToken);
    }

    return next.handle();
  }
}
