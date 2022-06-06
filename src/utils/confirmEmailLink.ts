import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

export const confirmEmailLink = async (url: string, userId: string, redis: Redis) => {
    const id = uuidv4();
    await redis.set(id, userId, 'ex', 60*10); // set id to expire after 10 minutes
    return `${url}/confirm/${id}`;
}