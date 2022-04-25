import { EntityRepository, Repository } from 'typeorm';
import { CreditCard } from '../../model/entity/credit-card.entity';
import {
  CreateCreditCardParams,
  UpdateCreditCardParams,
} from './credit-card.interface';

@EntityRepository(CreditCard)
export class CreditCardRepository extends Repository<CreditCard> {
  async createCreditCard(params: CreateCreditCardParams): Promise<CreditCard> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async updateCreditCard(
    creditCardId: number,
    params: UpdateCreditCardParams,
  ): Promise<CreditCard | undefined> {
    const creditCard = await this.createQueryBuilder('creditCards')
      .where('creditCards.id = :creditCardId', { creditCardId })
      .getOne();

    if (!creditCard) {
      return undefined;
    }

    return this.save({
      id: creditCardId,
      number: params.number ?? creditCard.number,
      holderName: params.holderName ?? creditCard.holderName,
      cvv: params.cvv ?? creditCard.cvv,
      expiryDate: params.expiryDate ?? creditCard.expiryDate,
    });
  }

  async getUserIdById(id: number): Promise<number | undefined> {
    const result = await this.createQueryBuilder('creditCards')
      .select('creditCars.userId', 'userId')
      .where('creditCards.id = :id', { id })
      .getRawOne();

    return result?.userId;
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.softDelete({ id });

    return !!result.affected;
  }

  async getDefaultByUserId(userId: number): Promise<CreditCard | undefined> {
    return this.createQueryBuilder('creditCards')
      .where('creditCards.userId = :userId', { userId })
      .andWhere('creditCards.isDefault = true')
      .getOne();
  }

  async setAllToNonDefault(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(CreditCard, { isDefault: false })
      .where('userId = :userId', { userId })
      .execute();
  }

  async getAllByUserId(userId: number): Promise<CreditCard[]> {
    return this.createQueryBuilder('creditCards')
      .where('creditCards.userId = :userId', { userId })
      .getMany();
  }
}
