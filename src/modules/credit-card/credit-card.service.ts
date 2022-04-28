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
    currentUserId: string,
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
    currentUserId: string,
    creditCardId: string,
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
    currentUserId: string,
    creditCardId: string,
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

  async getDefaultCreditCard(userId: string): Promise<CreditCard> {
    const defaultCreditCard =
      await this.creditCardRepository.getDefaultByUserId(userId);
    if (!defaultCreditCard) {
      throw new NotFoundException(
        ExceptionMessageCode.DEFAULT_CREDIT_CARD_NOT_FOUND,
      );
    }

    return defaultCreditCard;
  }

  async getCreditCards(userId: string): Promise<CreditCard[]> {
    return this.creditCardRepository.getAllByUserId(userId);
  }

  async validateCreditCardById(creditCardId: string): Promise<void> {
    if (!(await this.creditCardRepository.existsById(creditCardId))) {
      throw new NotFoundException(ExceptionMessageCode.CREDIT_CARD_NOT_FOUND);
    }
  }
}
