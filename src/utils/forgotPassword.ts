import { Redis } from "ioredis";
import { User } from "../entity/User";
import { deleteUserSessions } from "./deleteSessions";


/**
 * Here we update the database so we can use the `forgotPasswordLocked` column to
 * block any login attempts by the user with the same password.
 * Then we delete all the running sessions on redis so the account is locked.
 * 
 * @param userId user's `id` in the postgres database
 * @param redis redis instance.
 */
export const forgotPasswordLockAccount = async (userId: string, redis: Redis) => {
  await User.update({ id: userId }, { accountLocked: true });
  await deleteUserSessions(userId, redis);
}