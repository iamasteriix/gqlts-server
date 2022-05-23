import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

export const confirmEmailLink = async (url: string, userId: string, redis: Redis) => {
    const id = uuidv4();
    await redis.set(id, userId, 'expire', 60*60*24);
    return `${url}/confirm/${id}`;
}