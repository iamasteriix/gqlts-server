import { sessionPrefices } from "../../../redis";
import { ResolverMap } from "../../../types/graphql-utils";


export const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { redis, session }) => {
      const userId = session.userId;
      const redisPfx = sessionPrefices.redisSessionPrefix;
      const userSessKey = `${sessionPrefices.userSessionPrefix}${userId}`;

      if (userId) {
        const sessionIds = await redis.lrange(userSessKey, 0, -1);
        const promiseToDel: Promise<number>[] = [];

        for (const id of sessionIds)
          promiseToDel.push(redis.del(`${redisPfx}${id}`));

        await Promise.all(promiseToDel);      
        await redis.del(userSessKey);
        return true;
      }
      return false;
    }
  }
}