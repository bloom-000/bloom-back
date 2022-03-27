import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../../model/entity/user.entity';

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
}
