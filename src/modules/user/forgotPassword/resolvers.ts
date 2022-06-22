import yup from 'yup';
import bcrypt from 'bcryptjs';
import { User } from "../../../entity/User";
import { redisPrefices } from "../../../redis";
import { ResolverMap } from "../../../types/graphql-utils";
import { MutationForgotPasswordChangeItArgs, MutationSendForgotPasswordEmailArgs } from "../../../types/schema";
import { formatYupError } from '../../../utils/formatYupError';
import { errorMessages, yupPassword } from "../../constants";
import { sendEmail } from '../../../utils/sendEmail';
import { resetPasswordLink } from '../../../routes/views/htmlTemplates';
import { Redis } from 'ioredis';
import { deleteUserSessions } from '../../../utils/deleteSessions';
import { forgotPasswordLink } from '../../../utils/createLinks';


/**
 * Here we update the database so we can use the `forgotPasswordLocked` column to
 * block any login attempts by the user with the same password.
 * Then we delete all the running sessions on redis so the account is locked.
 * 
 * @param userId user's `id` in the postgres database
 * @param redis redis instance.
 */
const forgotPasswordLockAccount = async (userId: string, redis: Redis) => {
  await User.update({ id: userId }, { accountLocked: true });
  await deleteUserSessions(userId, redis);
}

export const resolvers: ResolverMap = {
  Mutation: {
    sendForgotPasswordEmail: async (_, { email }: MutationSendForgotPasswordEmailArgs, { url, redis }) => {
      const user = await User.findOne({ where: { email }});

      if (!user)
        return [{
          path: 'email',
          message: errorMessages.userDoesNotExist
        }];

      const userId = user.id;
      await forgotPasswordLockAccount(userId, redis);
      const link = await forgotPasswordLink(url, userId, redis);
      await sendEmail(email, 'Reset password', resetPasswordLink(link));
      
      return true;       
    },

    forgotPasswordChangeIt: async (_, { newPassword, key }: MutationForgotPasswordChangeItArgs, { redis }) => {
      const userId = await redis.get(`${redisPrefices.forgotPassword}${key}`);
      const yupSchema = yup.object().shape({ password: yupPassword });

      if (!userId)
      return [{
        path: 'key',
        message: errorMessages.expiredKey
      }];

      try {
        await yupSchema.validate( { newPassword }, { abortEarly: false });
      } catch (error) {
        return formatYupError(error);
      }

      await User.update(
        {id: userId },
        {
          accountLocked: false,
          password: await bcrypt.hash(newPassword, 2)
        });

      return null;
    }
  }
}