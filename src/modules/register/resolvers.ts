import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { MutationRegisterArgs } from '../../types/schema';
import { confirmEmailLink } from '../../utils/confirmEmailLink';
import { formatYupError } from '../../utils/formatYupError';
import { errorMessages } from './constants';


const schema = yup.object().shape({
    email: yup.string().min(5, errorMessages.emailNotLongEnough).max(255).email(),
    password: yup.string().min(8).max(255)
});


export const resolvers: ResolverMap = {
    Mutation: {
        register: async (_, args: MutationRegisterArgs, { redis, url }) => {

            // validate user signup input
            try {
                await schema.validate(args.input, { abortEarly: false });
            } catch (error) {
                return formatYupError(error);
            }

            const { email, password } = args.input;

            // check if user already exists
            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ['id']
            });

            if (userAlreadyExists) {
                return [
                    {
                        path: 'email',
                        message: errorMessages.duplicateEmail
                    }]
            }

            // add user email and password
            const hashedPassword = await bcrypt.hash(password, 2);
            const user = await User.create({
                email: email,
                password: hashedPassword
            }).save();

            // const link =
            await confirmEmailLink(url, user.id, redis);

            return null;
        }
    }
};