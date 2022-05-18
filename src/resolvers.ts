import * as bcrypt from 'bcryptjs';

import { MutationRegisterArgs } from "./types/schema";
import { ResolverMap } from "./types/graphql-utils";
import { User } from './entity/User';

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
        register: async (_, { email, password }: MutationRegisterArgs) => {
            const hashPassword = await bcrypt.hash(password, 32);
            await User.create({
                email: email,
                password: hashPassword
            });
            return true;
        }
    }
};