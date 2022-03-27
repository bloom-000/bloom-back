import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from '../../model/dto/authentication/sign-in.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { AuthenticationService } from './authentication.service';
import { Request, Response } from 'express';

@Controller('/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

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

  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    return this.authenticationService.refreshToken(request, response);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() request: Request, @Res() response: Response) {
    return this.authenticationService.logout(request, response);
  }

  @Get('/authenticated')
  @HttpCode(HttpStatus.NO_CONTENT)
  async getIsAuthenticated(@Req() request: Request): Promise<void> {
    return this.authenticationService.validateAuthentication(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  test() {
    return 'test';
  }
}
