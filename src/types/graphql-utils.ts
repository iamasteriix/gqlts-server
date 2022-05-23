import { Redis } from "ioredis";

/**
 * custom resolver type definition for registration resolver
 * currently used in resolvers.ts
 */
export interface ResolverMap {
    [key: string]: {
        [key: string]: (
            parent: any,
            args: any,
            context: { redis: Redis, url: string },
            info: any) => any;
    }
}