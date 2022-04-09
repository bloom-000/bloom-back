import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CookieJwtStrategy } from '../authentication/cookie-jwt.strategy';
import { AuthenticationCookieService } from '../authentication/authentication-cookie.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository])],
  controllers: [CategoryController],
  providers: [CategoryService, CookieJwtStrategy, AuthenticationCookieService],
  exports: [CategoryService],
})
export class CategoryModule {}
