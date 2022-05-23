import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { MutationRegisterArgs } from '../../types/schema';


export const resolvers: ResolverMap = {
    Mutation: {
        register: async (_, args: MutationRegisterArgs) => {
            const userInput = args.input;
            const hashedPassword = await bcrypt.hash(userInput.password, 2);
            await User.create({
                email: userInput.email,
                password: hashedPassword
            }).save();
            return true
        }
    }
};