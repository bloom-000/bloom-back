import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../../model/entity/user.entity';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
import { Permission } from '../../model/entity/permission.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email);
  }

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    return this.userRepository.findByRefreshToken(refreshToken);
  }

  async clearRefreshTokensForUser(userId: number): Promise<void> {
    return this.userRepository.updateRefreshTokens(userId, []);
  }

  async addRefreshTokenTo(userId: number, refreshToken: string) {
    const refreshTokens = await this.userRepository.getRefreshTokensFor(userId);
    refreshTokens.push(refreshToken);
    return this.userRepository.updateRefreshTokens(userId, refreshTokens);
  }

  async removeRefreshTokenFor(userId: number, refreshToken: string) {
    const refreshTokens = await this.userRepository.getRefreshTokensFor(userId);
    const newRefreshTokens = refreshTokens.filter((e) => e !== refreshToken);
    return this.userRepository.updateRefreshTokens(userId, newRefreshTokens);
  }

  async getUserPermissions(userId: number): Promise<Permission[]> {
    const roles = await this.userRepository.getRolesForUser(userId);
    if (!roles) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }

    return [].concat(...roles.map((e) => e.permissions));
  }
}
