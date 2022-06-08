import { GraphqlMiddlewareFunction, Resolver } from "../types/graphql-utils";


/**
 * This is a higher-order function that takes a middleware function and a 
 * resolver function and returns a regular resolver.
 * 
 * @param middlewareFun 
 * @param resolverFun 
 * @returns 
 */
export const createMiddleware = (middlewareFun: GraphqlMiddlewareFunction, resolverFun: Resolver) => 
    (parent: any, args: any, context: any, info: any) =>
    middlewareFun(resolverFun, parent, args, context, info);