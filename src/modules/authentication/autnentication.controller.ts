import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SignInDto } from '../../model/dto/authentication/sign-in.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticationService } from './authentication.service';

@Controller('/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/sign-in')
  async signIn(@Body() body: SignInDto) {
    return this.authenticationService.signIn(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  test() {
    return 'test';
  }
}
