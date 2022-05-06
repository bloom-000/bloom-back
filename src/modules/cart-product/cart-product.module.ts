import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductRepository } from './cart-product.repository';
import { CartProductService } from './cart-product.service';
import { CartProductController } from './cart-product.controller';
import { CurrentUserPayloadInterceptorModule } from '../../decorator/current-user-payload.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartProductRepository]),
    CurrentUserPayloadInterceptorModule,
  ],
  controllers: [CartProductController],
  providers: [CartProductService],
  exports: [CartProductService],
})
export class CartProductModule {}
