import { Injectable, OnModuleInit } from '@nestjs/common';
import { PasswordEncoder } from '../authentication/helper/password.encoder';

export interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly passwordEncoder: PasswordEncoder) {}

  private readonly users: User[] = [];

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
      },
      {
        id: 2,
        email: 'email@gmail.com',
        password: password,
      },
    );
  }
}
