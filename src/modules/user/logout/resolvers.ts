import { ResolverMap } from "../../../types/graphql-utils";
import { deleteUserSessions } from "../../../utils/deleteSessions";


export const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { redis, session }) => {
      const userId = session.userId;      

      if (userId) {
        await deleteUserSessions(userId, redis);
        return true;
      }
      return false;
    }
  }
}