import { EntityRepository, Repository } from 'typeorm';
import { ShippingAddress } from '../../model/entity/shipping-address.entity';
import {
  CreateShippingAddressParams,
  UpdateShippingAddressParams,
} from './shipping-address.interface';

@EntityRepository(ShippingAddress)
export class ShippingAddressRepository extends Repository<ShippingAddress> {
  async createShippingAddress(
    params: CreateShippingAddressParams,
  ): Promise<ShippingAddress> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async setAllToNonDefault(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(ShippingAddress, { isDefault: false })
      .where('userId = :userId', { userId })
      .execute();
  }

  async updateShippingAddress(
    shippingAddress: ShippingAddress,
    params: UpdateShippingAddressParams,
  ): Promise<ShippingAddress | undefined> {
    return this.save({
      id: shippingAddress.id,
      fullName: params.fullName || shippingAddress.fullName,
      phoneNumber: params.phoneNumber || shippingAddress.phoneNumber,
      country: params.country || shippingAddress.country,
      city: params.city || shippingAddress.city,
      streetAddress: params.streetAddress || shippingAddress.streetAddress,
      postalCode: params.postalCode || shippingAddress.postalCode,
      isDefault: params.isDefault || shippingAddress.isDefault,
    });
  }

  async getById(id: number): Promise<ShippingAddress | undefined> {
    return this.createQueryBuilder('shippingAddresses')
      .where('shippingAddresses.id = :id', { id })
      .getOne();
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.softDelete({ id });

    return !!result.affected;
  }

  async getUserIdById(id: number): Promise<number> {
    const result = await this.createQueryBuilder('shippingAddresses')
      .select('shippingAddresses.userId', 'userId')
      .where('shippingAddresses.id = :id', { id })
      .getRawOne();

    return result?.userId;
  }
}
