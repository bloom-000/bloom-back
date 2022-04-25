import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShippingAddressRepository } from './shipping-address.repository';
import {
  CreateShippingAddressParams,
  UpdateShippingAddressParams,
} from './shipping-address.interface';
import { ShippingAddress } from '../../model/entity/shipping-address.entity';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';

@Injectable()
export class ShippingAddressService {
  constructor(
    private readonly shippingAddressRepository: ShippingAddressRepository,
  ) {}

  async createShippingAddress(
    params: CreateShippingAddressParams,
  ): Promise<ShippingAddress> {
    if (params.isDefault) {
      await this.shippingAddressRepository.setAllToNonDefault(params.userId);
    }

    return this.shippingAddressRepository.createShippingAddress(params);
  }

  async updateShippingAddress(
    currentUserId: number,
    shippingAddressId: number,
    params: UpdateShippingAddressParams,
  ): Promise<ShippingAddress | undefined> {
    const shippingAddress = await this.shippingAddressRepository.getById(
      shippingAddressId,
    );
    if (!shippingAddress) {
      throw new NotFoundException(
        ExceptionMessageCode.SHIPPING_ADDRESS_NOT_FOUND,
      );
    }

    if (shippingAddress.userId !== currentUserId) {
      throw new ForbiddenException(
        ExceptionMessageCode.CANT_EDIT_OTHERS_SHIPPING_ADDRESS,
      );
    }

    if (params.isDefault) {
      await this.shippingAddressRepository.setAllToNonDefault(currentUserId);
    }

    return this.shippingAddressRepository.updateShippingAddress(
      shippingAddress,
      params,
    );
  }

  async deleteShippingAddress(
    currentUserId: number,
    shippingAddressId: number,
  ): Promise<void> {
    const shippingAddressUserId =
      await this.shippingAddressRepository.getUserIdById(shippingAddressId);
    if (!shippingAddressUserId) {
      throw new NotFoundException(
        ExceptionMessageCode.SHIPPING_ADDRESS_NOT_FOUND,
      );
    }

    if (currentUserId !== shippingAddressUserId) {
      throw new ForbiddenException(
        ExceptionMessageCode.CANT_DELETE_OTHERS_SHIPPING_ADDRESS,
      );
    }

    await this.shippingAddressRepository.deleteById(shippingAddressId);
  }
}
