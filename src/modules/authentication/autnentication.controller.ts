import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SignInDto } from '../../model/dto/authentication/sign-in.dto';
import { AuthenticationService } from './authentication.service';
import { Request, Response } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NoAuth } from '../../decorator/no-auth.decorator';
import { SignUpDto } from '../../model/dto/authentication/sign-up.dto';
import { AuthenticationPayloadDto } from '../../model/dto/authentication/authentication-payload.dto';

@ApiTags('authentication')
@Controller('/authentication')
@NoAuth()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Post('/admin/sign-in')
  async adminSignIn(
    @Body() body: SignInDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return this.authenticationService.signIn(
      {
        email: body.email,
        password: body.password,
      },
      request,
      response,
    );
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Post('/admin/refresh')
  async adminRefresh(@Req() request: Request, @Res() response: Response) {
    return this.authenticationService.refreshToken(request, response);
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/admin/sign-out')
  async adminLogout(@Req() request: Request, @Res() response: Response) {
    return this.authenticationService.logout(request, response);
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('/admin/status')
  async adminAuthenticationStatus(@Req() request: Request): Promise<void> {
    return this.authenticationService.validateAuthentication(request);
  }

  @ApiCreatedResponse()
  @Post('/sign-up')
  async signUp(@Body() body: SignUpDto): Promise<AuthenticationPayloadDto> {
    return this.authenticationService.signUpWithToken(body);
  }

  @ApiCreatedResponse()
  @Post('/sign-in')
  async signIn(@Body() body: SignInDto): Promise<AuthenticationPayloadDto> {
    return this.authenticationService.signInWithToken(body);
  }
}
