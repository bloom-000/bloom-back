import { Injectable, OnModuleInit } from '@nestjs/common';
import { PasswordEncoder } from '../authentication/helper/password.encoder';

export interface User {
  id: number;
  email: string;
  password: string;
  refreshTokens: string[];
}

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly passwordEncoder: PasswordEncoder) {}

  private users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((e) => e.email === email);
  }

  async onModuleInit() {
    const password = await this.passwordEncoder.encode('password');

    this.users.push(
      {
        id: 1,
        email: 'test@gmai.com',
        password: password,
        refreshTokens: [],
      },
      {
        id: 2,
        email: 'email@gmail.com',
        password: password,
        refreshTokens: [],
      },
    );
  }

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    return this.users.find((e) => e.refreshTokens.includes(refreshToken));
  }

  async clearRefreshTokensForUser(userId: number) {
    const user = this.users.find((e) => e.id === userId);
    const newUser: User = { ...user, refreshTokens: [] };
    this.users = this.users.filter((e) => e.id !== userId);
    this.users.push(newUser);
  }

  async removeRefreshTokenFor(userId: number, refreshToken: string) {
    const user = this.users.find((e) => e.id === userId);
    const newUser: User = {
      ...user,
      refreshTokens: user.refreshTokens.filter((rt) => rt !== refreshToken),
    };
    this.users = this.users.filter((e) => e.id !== userId);
    this.users.push(newUser);
  }

  async addRefreshTokenTo(userId: number, refreshToken: string) {
    const user = this.users.find((e) => e.id === userId);
    const newRefreshTokens = [...user.refreshTokens, refreshToken];
    const newUser: User = {
      ...user,
      refreshTokens: newRefreshTokens,
    };
    this.users = this.users.filter((e) => e.id !== userId);
    this.users.push(newUser);
  }
}
