import * as bcrypt from 'bcryptjs';
import { MutationRegisterArgs } from "./types/schema";
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
        register: async (_, args: MutationRegisterArgs) => {
            const userInput = args.input;
            const hashedPassword = await bcrypt.hash(userInput.password, 2);
            User.create({
                email: userInput.email,
                password: hashedPassword
            }).save();
            return true
        }
    }
};