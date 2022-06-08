import { ResolverMap } from "../../../types/graphql-utils";


export const resolvers: ResolverMap = {
    Mutation: {
        logout: (_, __, { session }) => session // .destroy();
    }
}