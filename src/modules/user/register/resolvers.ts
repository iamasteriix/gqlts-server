import * as yup from 'yup';
import { User } from '../../../entity/User';
import { ResolverMap } from '../../../types/graphql-utils';
import { MutationRegisterArgs } from '../../../types/schema';
import { confirmEmailLink } from '../../../utils/createLinks';
import { formatYupError } from '../../../utils/formatYupError';
import { sendEmail } from '../../../routes/sendEmail/sendEmail';
import { errorMessages } from '../../constants';


const schema = yup.object().shape({
    email: yup.string().min(5, errorMessages.emailNotLongEnough).max(255).email().required(),
    password: yup.string().min(8).max(255).required()
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
            const user = await User.create({ email, password }).save();

            // send verification email
            const link = await confirmEmailLink(url, user.id, redis);
            await sendEmail('niftylettuce@yahoo.com', email, link);

            return null;
        }
    }
};