import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CookieStrategyModule } from '../authentication/modules/cookie-strategy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository]),
    CookieStrategyModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
