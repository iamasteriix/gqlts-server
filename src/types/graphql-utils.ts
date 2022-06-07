import { Redis } from "ioredis";

/**
 * custom resolver type definition for registration resolver
 * currently used in resolvers.ts
 */
 export interface Session {
    userId?: string;
}

export type Resolver = (
    parent: any,
    args: any,
    context: { redis: Redis, url: string, session: Session },
    info: any) => any;

export type GraphqlMiddlewareFunction = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: { redis: Redis, url: string, session: Session },
    info: any) => any;

export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver;
    }
}