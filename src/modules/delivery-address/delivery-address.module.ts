import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryAddressRepository } from './delivery-address.repository';
import { DeliveryAddressService } from './delivery-address.service';
import { DeliveryAddressController } from './delivery-address.controller';
import { CurrentUserPayloadInterceptorModule } from '../../decorator/current-user-payload.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryAddressRepository]),
    CurrentUserPayloadInterceptorModule,
  ],
  providers: [DeliveryAddressService],
  controllers: [DeliveryAddressController],
  exports: [DeliveryAddressService],
})
export class DeliveryAddressModule {}
