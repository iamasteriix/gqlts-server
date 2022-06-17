import { User } from '../../../entity/User';
import { ResolverMap } from '../../../types/graphql-utils';
import { MutationRegisterArgs } from '../../../types/schema';
import { confirmEmailLink } from '../../../utils/createLinks';
import { formatYupError } from '../../../utils/formatYupError';
import { signingUp } from '../../../routes/views/htmlTemplates';
import { sendEmail } from '../../../utils/sendEmail';
import { errorMessages, yupSchema } from '../../constants';


export const resolvers: ResolverMap = {
    Mutation: {
        register: async (_, args: MutationRegisterArgs, { redis, url }) => {

            // validate user signup input
            try {
                await yupSchema.validate(args.input, { abortEarly: false });
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
            await sendEmail(email, 'Hello there, welcome to Pug!', signingUp(link));

            return null;
        }
    }
};