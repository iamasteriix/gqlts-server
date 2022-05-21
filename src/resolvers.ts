// import * as bcrypt from 'bcryptjs';

import { MutationRegisterArgs } from "./types/schema";
// import { User } from './entity/User';
import { ResolverMap } from './types/graphql-utils';
import { User } from "./entity/User";


const books = [
	{
		title: 'A Tale of Two Cities',
		author: 'Charles Dickens',
	},
];


export const resolvers: ResolverMap = {
    Query: {  
        books: () => books,
    },
    Mutation: {
        register: (_, args: MutationRegisterArgs) => {
            const userInput = args.input;
            User.create({
                email: userInput.email,
                password: userInput.password
            }).save();
            return true
        }
    }
};