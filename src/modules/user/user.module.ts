import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PasswordEncoder } from '../authentication/helper/password.encoder';

@Module({
  providers: [UserService, PasswordEncoder],
  exports: [UserService],
})
export class UserModule {}
