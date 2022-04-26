import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderProductModule } from './order-product/order-product.module';
import { ShippingAddressModule } from '../shipping-address/shipping-address.module';
import { CreditCardModule } from '../credit-card/credit-card.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository]),
    OrderProductModule,
    ShippingAddressModule,
    CreditCardModule,
    ProductModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
