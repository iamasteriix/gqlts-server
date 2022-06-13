import { Resolver } from "../../../types/graphql-utils";

/**
 * This function allows you to implement any middleware and afterware you need to run around any
 * resolvers. You can log the arguments, check user privileges and cookie sessions, among other
 * custom functions.
 */
export default async (resolver: Resolver, parent: any, args: any, context: any, info: any) => {
    // run middleware

    const result = await resolver(parent, args, context, info);

    // run afterware

    return result;
}