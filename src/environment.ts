import { config } from 'dotenv';

config();

const env = process.env;

export const environment = {
  port: parseInt(env.PORT || '3000'),
  accessTokenSecret: env.ACCESS_TOKEN_SECRET,
  accessTokenExpiration: Number(env.ACCESS_TOKEN_EXPIRATION),
  refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiration: Number(env.REFRESH_TOKEN_EXPIRATION),
};
