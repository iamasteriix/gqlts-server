/**
 * custom resolver type definition for registration resolver
 * currently used in all resolvers.ts
 */

import session from "express-session";
import { Redis } from "ioredis";


export interface Session extends session.Session {
    userId?: string;
}

export interface Context {
    redis: Redis;
    url: string;
    session: Session;
}

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info: any) => any;
 
export type GraphqlMiddlewareFunction = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: Context,
    info: any) => any;
 
export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver;
    }
}