import Redis from 'ioredis';

// initialize redis instance
export const redis = new Redis();

// redis session prefices.
export const sessionPrefices = {
    redisSessionPrefix: 'sess:',
    userSessionPrefix: 'userSessIds:'
}