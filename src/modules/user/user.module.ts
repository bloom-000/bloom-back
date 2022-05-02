import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { RefreshTokenRepository } from './refresh-token/refresh-token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, RefreshTokenRepository])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
