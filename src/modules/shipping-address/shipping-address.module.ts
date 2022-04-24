import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddressRepository } from './shipping-address.repository';
import { ShippingAddressService } from './shipping-address.service';
import { ShippingAddressController } from './shipping-address.controller';
import { CurrentUserPayloadInterceptorModule } from '../../decorator/current-user-payload.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShippingAddressRepository]),
    CurrentUserPayloadInterceptorModule,
  ],
  providers: [ShippingAddressService],
  controllers: [ShippingAddressController],
})
export class ShippingAddressModule {}
