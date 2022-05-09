import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../../model/entity/user.entity';
import { ExceptionMessageCode } from '../../common/exception-message-code.enum';
import { Permission } from '../../model/entity/permission.entity';
import { CreateUserParams, GetUsersParams } from './user.interface';
import { DataPage } from '../../model/common/data-page';
import { DateUtils } from '../../common/util/date.utils';
import { RefreshTokenRepository } from './refresh-token/refresh-token.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.getByEmail(email);
  }

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    const userId = await this.refreshTokenRepository.getUserIdByRefreshToken(
      refreshToken,
    );
    if (!userId) {
      return undefined;
    }

    return this.userRepository.findById(userId);
  }

  async clearRefreshTokensForUser(userId: string): Promise<void> {
    return this.refreshTokenRepository.deleteAllByUserId(userId);
  }

  async addRefreshTokenByUserId(userId: string, refreshToken: string) {
    await this.refreshTokenRepository.createRefreshToken({
      userId,
      refreshToken,
    });
  }

  async deleteRefreshToken(refreshToken: string) {
    return this.refreshTokenRepository.deleteByRefreshToken(refreshToken);
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

  async getUserIdByEmail(email: string): Promise<string> {
    return this.userRepository.getIdByEmail(email);
  }

  async updateUserPassword(userId: string, password: string): Promise<void> {
    return this.userRepository.updatePasswordById(userId, password);
  }
}
