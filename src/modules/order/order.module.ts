import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderProductModule } from './order-product/order-product.module';
import { DeliveryAddressModule } from '../delivery-address/delivery-address.module';
import { CreditCardModule } from '../credit-card/credit-card.module';
import { ProductModule } from '../product/product.module';
import { CurrentUserPayloadInterceptorModule } from '../../decorator/current-user-payload.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository]),
    OrderProductModule,
    DeliveryAddressModule,
    CreditCardModule,
    ProductModule,
    CurrentUserPayloadInterceptorModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
