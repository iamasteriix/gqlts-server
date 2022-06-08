import { Resolver } from "../../../types/graphql-utils";


export default async (resolver: Resolver, parent: any, args: any, context: any, info: any) => {

    // check if user is logged in by reading from context data
    // if (!context.session || !context.session.userId) // Do stuff

    // // check if user is an admin
    // // add new column `admin` to database if you need to implement this check
    // const findAdmin = User.findOne({ where: { id: context.session.userId } });    
    // if (!findAdmin || !findAdmin.admin) {
    //     throw Error("Are you sure you're an admin?");
    //     return null;
    // }

    // call middleware
    const result = await resolver(parent, args, context, info);

    // run afterware

    return result;
}