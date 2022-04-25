import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCreditCardParams,
  UpdateCreditCardParams,
} from './credit-card.interface';
import { CreditCard } from '../../model/entity/credit-card.entity';
import { CreditCardRepository } from './credit-card.repository';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';

@Injectable()
export class CreditCardService {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}

  async createCreditCard(
    currentUserId: number,
    params: Omit<CreateCreditCardParams, 'userId'>,
  ): Promise<CreditCard> {
    if (params.isDefault) {
      await this.creditCardRepository.setAllToNonDefault(currentUserId);
    }

    return this.creditCardRepository.createCreditCard({
      ...params,
      userId: currentUserId,
    });
  }

  async updateCreditCard(
    currentUserId: number,
    creditCardId: number,
    params: UpdateCreditCardParams,
  ): Promise<CreditCard> {
    const creditCardUserId = await this.creditCardRepository.getUserIdById(
      creditCardId,
    );

    if (!creditCardUserId) {
      throw new NotFoundException(ExceptionMessageCode.CREDIT_CARD_NOT_FOUND);
    }

    if (currentUserId !== creditCardUserId) {
      throw new ForbiddenException(
        ExceptionMessageCode.CANT_EDIT_OTHERS_CREDIT_CARD,
      );
    }

    if (params.isDefault) {
      await this.creditCardRepository.setAllToNonDefault(creditCardUserId);
    }

    return this.creditCardRepository.updateCreditCard(creditCardId, params);
  }

  async deleteCreditCard(
    currentUserId: number,
    creditCardId: number,
  ): Promise<void> {
    const creditCardUserId = await this.creditCardRepository.getUserIdById(
      creditCardId,
    );

    if (!creditCardUserId) {
      throw new NotFoundException(ExceptionMessageCode.CREDIT_CARD_NOT_FOUND);
    }

    if (currentUserId !== creditCardUserId) {
      throw new ForbiddenException(
        ExceptionMessageCode.CANT_EDIT_OTHERS_CREDIT_CARD,
      );
    }

    await this.creditCardRepository.deleteById(creditCardId);
  }

  async getDefaultCreditCard(userId: number): Promise<CreditCard> {
    const defaultCreditCard =
      await this.creditCardRepository.getDefaultByUserId(userId);
    if (!defaultCreditCard) {
      throw new NotFoundException(
        ExceptionMessageCode.DEFAULT_CREDIT_CARD_NOT_FOUND,
      );
    }

    return defaultCreditCard;
  }

  async getCreditCards(userId: number): Promise<CreditCard[]> {
    return this.creditCardRepository.getAllByUserId(userId);
  }
}
