import { ResolverMap } from "../../../types/graphql-utils";


export const resolvers: ResolverMap = {
    Mutation: {
        logout: (_, __, { session }) =>
        new Promise(resolve =>
            session.destroy(error => {
                if (error) console.log('Logout error: ', error);
                resolve(true);
            }))
    }
}