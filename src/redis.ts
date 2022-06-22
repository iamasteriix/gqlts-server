import Redis from 'ioredis';

// initialize redis instance
export const redis = new Redis();

// redis session prefices.
export const redisPrefices = {
  redisSessionPrefix: 'sess:',
  userSessionPrefix: 'userSessIds:',
  forgotPassword: 'forgotPassword:'
}