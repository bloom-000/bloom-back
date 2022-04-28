import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreditCardService } from './credit-card.service';
import { CreditCard } from '../../model/entity/credit-card.entity';
import { CreateCreditCardDto } from '../../model/dto/credit-card/create-credit-card.dto';
import {
  CurrentUserPayload,
  CurrentUserPayloadInterceptor,
} from '../../decorator/current-user-payload.decorator';
import { UserPayload } from '../../model/common/user.payload';
import { UpdateCreditCardDto } from '../../model/dto/credit-card/update-credit-card.dto';

@ApiTags('credit-cards')
@Controller('/credit-cards')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @ApiCreatedResponse()
  @Post()
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async createCreditCard(
    @Body() body: CreateCreditCardDto,
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<CreditCard> {
    return this.creditCardService.createCreditCard(currentUserPayload.userId, {
      ...body,
      number: body.cardNumber,
      holderName: body.cardHolderName,
    });
  }

  @ApiOkResponse()
  @Patch('/:id')
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async updateCreditCard(
    @Param('id') creditCardId: string,
    @Body() body: UpdateCreditCardDto,
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<CreditCard> {
    return this.creditCardService.updateCreditCard(
      currentUserPayload.userId,
      creditCardId,
      {
        ...body,
        number: body.cardNumber,
        holderName: body.cardHolderName,
      },
    );
  }

  @ApiOkResponse()
  @Delete('/:id')
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async deleteCreditCard(
    @Param('id') creditCardId: string,
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<void> {
    return this.creditCardService.deleteCreditCard(
      currentUserPayload.userId,
      creditCardId,
    );
  }

  @ApiOkResponse()
  @Get('/default')
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async getDefaultCreditCard(
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<CreditCard> {
    return this.creditCardService.getDefaultCreditCard(
      currentUserPayload.userId,
    );
  }

  @ApiOkResponse()
  @Get()
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async getCreditCards(
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<CreditCard[]> {
    return this.creditCardService.getCreditCards(currentUserPayload.userId);
  }
}
