import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../user/user.service';
import { ExceptionMessageCode } from '../../common/exception-message-code.enum';
import { PasswordEncoder } from './helper/password.encoder';
import { JwtHelper } from './helper/jwt.helper';
import { Request, Response } from 'express';
import { AuthenticationCookieService } from './authentication-cookie.service';
import {
  SignInParams,
  SignUpWithTokenParams,
} from './authentication.interface';
import { RandomGenerator } from '../../common/util/random.generator';
import { RecoverPasswordCacheService } from './recover-password-cache/recover-password-cache.service';
import { EmailService } from '../email/email.service';
import { environment } from '../../environment';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly authenticationCookieService: AuthenticationCookieService,
    private readonly randomGenerator: RandomGenerator,
    private readonly recoverPasswordCacheService: RecoverPasswordCacheService,
    private readonly emailService: EmailService,
  ) {}

  async signIn(params: SignInParams, request: Request, response: Response) {
    const user = await this.userService.getUserByEmail(params.email);
    if (!user) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const passwordMatches = await this.passwordEncoder.matches(
      params.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const oldRefreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (oldRefreshToken) {
      await this.userService.deleteRefreshToken(oldRefreshToken);
      this.authenticationCookieService.clearAuthenticationTokenCookies(
        response,
      );
    }
    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });
    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);
    this.authenticationCookieService.persistAuthenticationTokenCookies(
      response,
      refreshToken,
      accessToken,
    );
    response.send();
  }

  async refreshTokenFromCookie(request: Request, response: Response) {
    const oldRefreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (!oldRefreshToken) {
      throw new UnauthorizedException(
        ExceptionMessageCode.MISSING_REFRESH_TOKEN,
      );
    }

    this.authenticationCookieService.clearAuthenticationTokenCookies(response);

    const user = await this.userService.findByRefreshToken(oldRefreshToken);
    // noinspection DuplicatedCode
    if (!user) {
      const decodedPayload = await this.jwtHelper.getUserPayload(
        oldRefreshToken,
      );
      await this.userService.clearRefreshTokensForUser(decodedPayload.userId);
      throw new ForbiddenException(ExceptionMessageCode.REFRESH_TOKEN_REUSE);
    }

    if (!(await this.jwtHelper.isRefreshTokenValid(oldRefreshToken))) {
      await this.userService.deleteRefreshToken(oldRefreshToken);
      throw new ForbiddenException(ExceptionMessageCode.INVALID_TOKEN);
    }

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({ userId: user.id });
    await this.userService.deleteRefreshToken(oldRefreshToken);
    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);
    this.authenticationCookieService.persistAuthenticationTokenCookies(
      response,
      refreshToken,
      accessToken,
    );
    response.send();
  }

  async logout(request: Request, response: Response): Promise<void> {
    const oldRefreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (!oldRefreshToken) {
      return;
    }

    this.authenticationCookieService.clearAuthenticationTokenCookies(response);
    const user = await this.userService.findByRefreshToken(oldRefreshToken);
    if (!user) {
      return;
    }

    await this.userService.deleteRefreshToken(oldRefreshToken);
    response.send();
  }

  async validateAuthentication(request: Request) {
    const refreshToken =
      this.authenticationCookieService.getRefreshToken(request);
    if (!refreshToken) {
      throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
    }

    await this.jwtHelper.validateRefreshToken(refreshToken);
  }

  async signUpWithToken(params: SignUpWithTokenParams): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (await this.userService.userExistsByEmail(params.email)) {
      throw new ConflictException(
        ExceptionMessageCode.USER_EMAIL_ALREADY_EXISTS,
      );
    }

    const hashedPassword = await this.passwordEncoder.encode(params.password);
    const user = await this.userService.createUser({
      ...params,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });
    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signInWithToken(
    params: SignInParams,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.getUserByEmail(params.email);
    if (!user) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const passwordMatches = await this.passwordEncoder.matches(
      params.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });
    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshToken(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // noinspection DuplicatedCode
    const user = await this.userService.findByRefreshToken(oldRefreshToken);
    if (!user) {
      const decodedPayload = await this.jwtHelper.getUserPayload(
        oldRefreshToken,
      );
      await this.userService.clearRefreshTokensForUser(decodedPayload.userId);
      throw new ForbiddenException(ExceptionMessageCode.REFRESH_TOKEN_REUSE);
    }

    if (!(await this.jwtHelper.isRefreshTokenValid(oldRefreshToken))) {
      await this.userService.deleteRefreshToken(oldRefreshToken);
      throw new ForbiddenException(ExceptionMessageCode.INVALID_TOKEN);
    }

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({ userId: user.id });
    await this.userService.deleteRefreshToken(oldRefreshToken);
    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async requestRecoverPassword({ email }: { email: string }): Promise<void> {
    if (!(await this.userService.userExistsByEmail(email))) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }

    const code = await this.randomGenerator.generateRandomIntAsString(
      10000,
      99999,
    );

    await this.recoverPasswordCacheService.createRecoverPasswordCache({
      email,
      isConfirmed: false,
      code,
    });

    await this.emailService.sendRequestRecoverPasswordEmail(
      environment.isDebug ? environment.debugEmail : email,
      code,
    );
  }

  async recoverPasswordConfirmCode({
    email,
    code,
  }: {
    email: string;
    code: string;
  }): Promise<{ uuid: string }> {
    const recoverPasswordCache =
      await this.recoverPasswordCacheService.getRecoverPasswordCacheByEmail(
        email,
      );

    await this.recoverPasswordCacheService.validateRecoverPasswordCacheExpiration(
      recoverPasswordCache,
    );

    if (recoverPasswordCache.code !== code) {
      throw new BadRequestException(ExceptionMessageCode.INVALID_CODE);
    }

    const uuid = uuidv4();

    await this.recoverPasswordCacheService.updateRecoverPasswordCache(
      recoverPasswordCache.id,
      { uuid, isConfirmed: true },
    );

    return { uuid };
  }

  async recoverPassword({
    newPassword,
    uuid,
  }: {
    newPassword: string;
    uuid: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const recoverPasswordCache =
      await this.recoverPasswordCacheService.getRecoverPasswordCacheByUUID(
        uuid,
      );

    const userId = await this.userService.getUserIdByEmail(
      recoverPasswordCache.email,
    );

    const hashResult = await this.passwordEncoder.encode(newPassword);
    await this.userService.updateUserPassword(userId, hashResult);

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({ userId });
    await this.userService.addRefreshTokenByUserId(userId, refreshToken);

    await this.recoverPasswordCacheService.deleteRecoverPasswordCacheById(
      recoverPasswordCache.id,
    );

    return { accessToken, refreshToken };
  }

  async recoverPasswordSendVerificationCode(email: string): Promise<void> {
    const recoverPasswordCache =
      await this.recoverPasswordCacheService.getRecoverPasswordCacheByEmail(
        email,
      );

    await this.recoverPasswordCacheService.validateRecoverPasswordCacheExpiration(
      recoverPasswordCache,
    );

    const code = await this.randomGenerator.generateRandomIntAsString(
      10000,
      99999,
    );

    await this.recoverPasswordCacheService.updateRecoverPasswordCodeById(
      recoverPasswordCache.id,
      code,
    );

    await this.emailService.sendRequestRecoverPasswordEmail(email, code);
  }
}
