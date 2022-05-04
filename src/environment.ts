import { config } from 'dotenv';

config();

const env = process.env;

export const environment = {
  isDebug: env.ENVIRONMENT === 'production',
  port: parseInt(env.PORT || '3000'),
  accessTokenSecret: env.ACCESS_TOKEN_SECRET,
  accessTokenExpiration: Number(env.ACCESS_TOKEN_EXPIRATION),
  refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiration: Number(env.REFRESH_TOKEN_EXPIRATION),
  recoverPasswordCacheTimeoutInMillis: Number(
    env.RECOVER_PASSWORD_CACHE_TIMEOUT_IN_MILLIS,
  ),
  emailHost: env.EMAIL_HOST,
  emailUser: env.EMAIL_USER,
  emailPassword: env.EMAIL_PASSWORD,
  debugEmail: env.DEBUG_EMAIL,
};
