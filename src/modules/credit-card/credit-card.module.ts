import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCardRepository } from './credit-card.repository';
import { CreditCardService } from './credit-card.service';
import { CreditCardController } from './credit-card.controller';
import { CurrentUserPayloadInterceptorModule } from '../../decorator/current-user-payload.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditCardRepository]),
    CurrentUserPayloadInterceptorModule,
  ],
  providers: [CreditCardService],
  controllers: [CreditCardController],
  exports: [CreditCardService],
})
export class CreditCardModule {}
