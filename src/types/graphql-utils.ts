/**
 * custom resolver type definition for our current resolver
 * currently used in resolvers.ts
 */

export interface ResolverMap {
    [key: string]: {
        [key: string]: (parent: any, args: any, context: {}, info: any) => any;
    }
}