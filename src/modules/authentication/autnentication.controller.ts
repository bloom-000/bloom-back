import {
  Body,
  Controller,
  Get,
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
  async signIn(@Body() body: SignInDto) {
    return this.authenticationService.signIn(body);
  }

  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    return this.authenticationService.refreshToken(request, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  test() {
    return 'test';
  }
}
