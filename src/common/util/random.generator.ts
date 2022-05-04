import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomGenerator {
  private static readonly ASCII =
    '!"#$%&\'()*+,-./:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz0123456789{|}~';
  private static readonly ASCII_LENGTH = RandomGenerator.ASCII.length;

  async generateRandomASCII(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += RandomGenerator.ASCII.charAt(
        Math.floor(Math.random() * RandomGenerator.ASCII_LENGTH),
      );
    }
    return result;
  }

  async generateRandomInt(min: number, max: number): Promise<number> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async generateRandomIntAsString(min: number, max: number): Promise<string> {
    const number = Math.floor(Math.random() * (max - min + 1)) + min;

    return number.toString();
  }

  async generateRandomNumber(min: number, max: number): Promise<number> {
    return Math.random() * (max - min) + min;
  }
}
