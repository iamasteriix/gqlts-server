/**
 * custom resolver type definition for registration resolver
 * currently used in all resolvers.ts
 */

import { Redis } from "ioredis";

export interface Session { // need to extend Express session.
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