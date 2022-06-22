import * as bcrypt from 'bcryptjs';
import { User } from '../../../entity/User';
import { redisPrefices } from '../../../redis';
import { signingUp } from '../../../routes/views/htmlTemplates';
import { ResolverMap } from '../../../types/graphql-utils';
import { MutationLoginArgs } from '../../../types/schema';
import { confirmEmailLink } from '../../../utils/createLinks';
import { sendEmail } from '../../../utils/sendEmail';
import { errorMessages } from '../../constants';


export const resolvers: ResolverMap = {
  Mutation: {
    login: async (_, args: MutationLoginArgs, { redis, url, session, request }) => {
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
        const link = await confirmEmailLink(url, user.id, redis);
        await sendEmail(email, "Looks like you didn't confirm your email!", signingUp(link));        
        return [{
          path: 'email',
          message: errorMessages.emailNotConfirmed
        }];
      }

      // check if account is locked
      if (user.accountLocked) {
        return [{
          path: 'email',
          message: errorMessages.forgotPasswordLockedError
        }]
      }

      // verify correct password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return invalidLoginResponse;

      // login successful
      session.userId = user.id;
      if (request.sessionID) redis.lpush(`${redisPrefices.userSessionPrefix}${user.id}`, request.sessionID);

      return null;
    }
  }
};