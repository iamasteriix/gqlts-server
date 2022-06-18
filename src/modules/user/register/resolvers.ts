import { User } from '../../../entity/User';
import { ResolverMap } from '../../../types/graphql-utils';
import { MutationRegisterArgs } from '../../../types/schema';
import { formatYupError } from '../../../utils/formatYupError';
import { signingUp } from '../../../routes/views/htmlTemplates';
import { sendEmail } from '../../../utils/sendEmail';
import { errorMessages, yupSchema } from '../../constants';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';


/**
 * This function uses the user's id from the database to create a temporary id on redis
 * and subsequently, a link that allows the application to update the user's registration
 * confirmation status on the database.
 * 
 * @param url the website's base url.
 * @param userId the user Id from the database.
 * @param redis a redis instance.
 * @returns a link that informs the server to update the database `confirmed` registration status.
 */
const confirmEmailLink = async (url: string, userId: string, redis: Redis) => {
  const id = uuidv4();
  await redis.set(id, userId, 'ex', 60*10); // set id to expire after 10 minutes
  return `${url}/confirm/${id}`;
}

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