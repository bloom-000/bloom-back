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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(
    @Body() body: SignInDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return this.authenticationService.signIn(
      body.email,
      body.password,
      request,
      response,
    );
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    return this.authenticationService.refreshToken(request, response);
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/sign-out')
  async logout(@Req() request: Request, @Res() response: Response) {
    return this.authenticationService.logout(request, response);
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('/status')
  async getAuthenticationStatus(@Req() request: Request): Promise<void> {
    return this.authenticationService.validateAuthentication(request);
  }
}
