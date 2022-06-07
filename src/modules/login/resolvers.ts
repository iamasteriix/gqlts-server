import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { MutationLoginArgs } from '../../types/schema';
import { errorMessages } from '../../constants';


export const resolvers: ResolverMap = {
    Mutation: {
        login: async (_, args: MutationLoginArgs, { session }) => {
            const { email, password } = args.input;
            const invalidLoginResponse = [{
                path: 'email',
                message: errorMessages.invalidLogin
            }];

            // check if user exists in database
            const user = await User.findOne({ where: { email } });
            if (!user) return invalidLoginResponse;

            // check if user has confirmed email
            if (!user.confirmed) {
                return [{
                    path: 'email',
                    message: errorMessages.emailNotConfirmed
                }];
            }

            // verify correct password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return invalidLoginResponse;

            // login successful
            session.userId = user.id;

            return null;
        }
    }
};