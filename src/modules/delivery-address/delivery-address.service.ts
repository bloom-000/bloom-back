import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryAddressRepository } from './delivery-address.repository';
import {
  CreateDeliveryAddressParams,
  UpdateDeliveryAddressParams,
} from './delivery-address.interface';
import { DeliveryAddress } from '../../model/entity/delivery-address.entity';
import { ExceptionMessageCode } from '../../common/exception-message-code.enum';

@Injectable()
export class DeliveryAddressService {
  constructor(
    private readonly deliveryAddressRepository: DeliveryAddressRepository,
  ) {}

  async createShippingAddress(
    params: CreateDeliveryAddressParams,
  ): Promise<DeliveryAddress> {
    if (params.isDefault) {
      await this.deliveryAddressRepository.setAllToNonDefault(params.userId);
    }

    return this.deliveryAddressRepository.createDeliveryAddress(params);
  }

  async updateDeliveryAddress(
    currentUserId: string,
    deliveryAddressId: string,
    params: UpdateDeliveryAddressParams,
  ): Promise<DeliveryAddress | undefined> {
    const deliveryAddress = await this.deliveryAddressRepository.getById(
      deliveryAddressId,
    );
    if (!deliveryAddress) {
      throw new NotFoundException(
        ExceptionMessageCode.DELIVERY_ADDRESS_NOT_FOUND,
      );
    }

    if (deliveryAddress.userId !== currentUserId) {
      throw new ForbiddenException(
        ExceptionMessageCode.CANT_EDIT_OTHERS_DELIVERY_ADDRESS,
      );
    }

    if (params.isDefault) {
      await this.deliveryAddressRepository.setAllToNonDefault(currentUserId);
    }

    return this.deliveryAddressRepository.updateDeliveryAddress(
      deliveryAddress,
      params,
    );
  }

  async deleteDeliveryAddress(
    currentUserId: string,
    deliveryAddressId: string,
  ): Promise<void> {
    const deliveryAddressUserId =
      await this.deliveryAddressRepository.getUserIdById(deliveryAddressId);
    if (!deliveryAddressUserId) {
      throw new NotFoundException(
        ExceptionMessageCode.DELIVERY_ADDRESS_NOT_FOUND,
      );
    }

    if (currentUserId !== deliveryAddressUserId) {
      throw new ForbiddenException(
        ExceptionMessageCode.CANT_DELETE_OTHERS_DELIVERY_ADDRESS,
      );
    }

    await this.deliveryAddressRepository.deleteById(deliveryAddressId);
  }

  async getDefaultShippingAddress(userId: string): Promise<DeliveryAddress> {
    const defaultShippingAddress =
      await this.deliveryAddressRepository.getDefaultByUserId(userId);
    if (!defaultShippingAddress) {
      throw new NotFoundException(
        ExceptionMessageCode.DEFAULT_DELIVERY_ADDRESS_NOT_FOUND,
      );
    }

    return defaultShippingAddress;
  }

  async getShippingAddresses(userId: string): Promise<DeliveryAddress[]> {
    return this.deliveryAddressRepository.getAllByUserId(userId);
  }

  async validateDeliveryAddressById(deliveryAddressId: string): Promise<void> {
    if (!(await this.deliveryAddressRepository.existsById(deliveryAddressId))) {
      throw new NotFoundException(
        ExceptionMessageCode.DELIVERY_ADDRESS_NOT_FOUND,
      );
    }
  }
}
