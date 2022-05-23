import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { MutationRegisterArgs } from '../../types/schema';


export const resolvers: ResolverMap = {
    Mutation: {
        register: async (_, args: MutationRegisterArgs) => {
            const userInput = args.input;
            const email = userInput.email;

            // check if user already exists
            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ['id']
            });

            if (userAlreadyExists) {
                return [
                    {
                        path: 'email',
                        message: 'already taken'
                    }]
            }

            // add user email and password
            const hashedPassword = await bcrypt.hash(userInput.password, 2);
            await User.create({
                email: email,
                password: hashedPassword
            }).save();
            return null
        }
    }
};