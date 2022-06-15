import { sessionPrefices } from "../../../redis";
import { ResolverMap } from "../../../types/graphql-utils";


export const resolvers: ResolverMap = {
    Mutation: {
        logout: async (_, __, { redis, session }) => {
            const userId = session.userId;

            if (userId) {
                const sessionIds = await redis.lrange(`${sessionPrefices.userSessionPrefix}${userId}`, 0, -1);
                
                for (const id of sessionIds) await redis.del(`${sessionPrefices.redisSessionPrefix}${id}`);
                return true;
            }
            return false;
        }
    }
}