import { EntityRepository, Repository } from 'typeorm';
import { DeliveryAddress } from '../../model/entity/delivery-address.entity';
import {
  CreateDeliveryAddressParams,
  UpdateDeliveryAddressParams,
} from './delivery-address.interface';

@EntityRepository(DeliveryAddress)
export class DeliveryAddressRepository extends Repository<DeliveryAddress> {
  async createDeliveryAddress(
    params: CreateDeliveryAddressParams,
  ): Promise<DeliveryAddress> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async setAllToNonDefault(userId: string): Promise<void> {
    await this.createQueryBuilder()
      .update(DeliveryAddress, { isDefault: false })
      .where('userId = :userId', { userId })
      .execute();
  }

  async updateDeliveryAddress(
    deliveryAddress: DeliveryAddress,
    params: UpdateDeliveryAddressParams,
  ): Promise<DeliveryAddress | undefined> {
    return this.save({
      id: deliveryAddress.id,
      fullName: params.fullName ?? deliveryAddress.fullName,
      phoneNumber: params.phoneNumber ?? deliveryAddress.phoneNumber,
      country: params.country ?? deliveryAddress.country,
      city: params.city ?? deliveryAddress.city,
      streetAddress: params.streetAddress ?? deliveryAddress.streetAddress,
      postalCode: params.postalCode ?? deliveryAddress.postalCode,
      isDefault: params.isDefault ?? deliveryAddress.isDefault,
    });
  }

  async getById(id: string): Promise<DeliveryAddress | undefined> {
    return this.createQueryBuilder('deliveryAddresses')
      .where('deliveryAddresses.id = :id', { id })
      .getOne();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.softDelete({ id });

    return !!result.affected;
  }

  async getUserIdById(id: string): Promise<string> {
    const result = await this.createQueryBuilder('deliveryAddresses')
      .select('deliveryAddresses.userId', 'userId')
      .where('deliveryAddresses.id = :id', { id })
      .getRawOne();

    return result?.userId;
  }

  async getDefaultByUserId(
    userId: string,
  ): Promise<DeliveryAddress | undefined> {
    return this.createQueryBuilder('deliveryAddresses')
      .where('deliveryAddresses.userId = :userId', { userId })
      .andWhere('deliveryAddresses.isDefault = true')
      .getOne();
  }

  async getAllByUserId(userId: string): Promise<DeliveryAddress[]> {
    return this.createQueryBuilder('deliveryAddresses')
      .where('deliveryAddresses.userId = :userId', { userId })
      .getMany();
  }

  async existsById(deliveryAddressId: string) {
    const count = await this.createQueryBuilder('deliveryAddresses')
      .where('deliveryAddresses.id = :deliveryAddressId', { deliveryAddressId })
      .getCount();

    return count > 0;
  }
}
