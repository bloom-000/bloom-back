import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../../model/entity/user.entity';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
import { Permission } from '../../model/entity/permission.entity';
import { CreateUserParams, GetUsersParams } from './user.interface';
import { DataPage } from '../../model/common/data-page';
import { DateUtils } from '../../common/util/date.utils';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email);
  }

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    return this.userRepository.findByRefreshToken(refreshToken);
  }

  async clearRefreshTokensForUser(userId: string): Promise<void> {
    return this.userRepository.updateRefreshTokens(userId, []);
  }

  async addRefreshTokenTo(userId: string, refreshToken: string) {
    const refreshTokens = await this.userRepository.getRefreshTokensFor(userId);
    refreshTokens.push(refreshToken);
    return this.userRepository.updateRefreshTokens(userId, refreshTokens);
  }

  async removeRefreshTokenFor(userId: string, refreshToken: string) {
    const refreshTokens = await this.userRepository.getRefreshTokensFor(userId);
    const newRefreshTokens = refreshTokens.filter((e) => e !== refreshToken);
    return this.userRepository.updateRefreshTokens(userId, newRefreshTokens);
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const roles = await this.userRepository.getRolesForUser(userId);
    if (!roles) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }

    return [].concat(...roles.map((e) => e.permissions));
  }

  async getUsers(params: GetUsersParams): Promise<DataPage<User>> {
    return this.userRepository.getUsers(params);
  }

  async userExistsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  async createUser(params: CreateUserParams): Promise<User> {
    return this.userRepository.createUser(params);
  }

  async getUserDetails(id: string): Promise<User> {
    const user = await this.userRepository.getUserDetails(id);
    if (!user) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }

    return user;
  }

  async getRegisteredCountAfterMidnight(): Promise<number> {
    return this.userRepository.getCountAfterDate(DateUtils.getMidnight());
  }
}
