import { ResolverMap } from "../../../types/graphql-utils";
import { QueryHelloArgs } from "../../../types/schema";

export const resolvers: ResolverMap = {
    Query: {
        hello: (_, { name }: QueryHelloArgs) => `Hello ${ name || 'World'}`
    }
}