import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProductRepository } from './order-product.repository';
import { ProductModule } from '../../product/product.module';
import { OrderModule } from '../order.module';
import { OrderProductService } from './order-product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderProductRepository]),
    ProductModule,
    forwardRef(() => OrderModule),
  ],
  providers: [OrderProductService],
  exports: [OrderProductService],
})
export class OrderProductModule {}
