import yup from 'yup';
import bcrypt from 'bcryptjs';
import { User } from "../../../entity/User";
import { redisPrefices } from "../../../redis";
import { ResolverMap } from "../../../types/graphql-utils";
import { MutationForgotPasswordChangeItArgs, MutationSendForgotPasswordEmailArgs } from "../../../types/schema";
import { forgotPasswordLink } from "../../../utils/createLinks";
import { formatYupError } from '../../../utils/formatYupError';
import { forgotPasswordLockAccount } from "../../../utils/forgotPassword";
import { errorMessages, yupPassword } from "../../constants";
import { sendEmail } from '../../../utils/sendEmail';
import { resetPasswordLink } from '../../../routes/views/htmlTemplates';


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