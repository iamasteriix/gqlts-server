import { Redis } from "ioredis";
import { redisPrefices } from "../redis";


export const deleteUserSessions = async (userId: string, redis: Redis) => {
  const userSessKey = `${redisPrefices.userSessionPrefix}${userId}`;
  const redisPfx = redisPrefices.redisSessionPrefix;
  const sessionIds = await redis.lrange(userSessKey, 0, -1);
  const promiseToDel: Promise<number>[] = [];

  for (const id of sessionIds)
    promiseToDel.push(redis.del(`${redisPfx}${id}`));

  await Promise.all(promiseToDel);      
  await redis.del(userSessKey);
}