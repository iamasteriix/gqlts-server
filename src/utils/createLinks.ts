import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import { redisPrefices } from '../redis';



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
export const confirmEmailLink = async (url: string, userId: string, redis: Redis) => {
  const id = uuidv4();
  await redis.set(id, userId, 'ex', 60*10); // set id to expire after 10 minutes
  return `${url}/confirm/${id}`;
}

/**
 * This function uses the user's id from the database to create a temporary id on redis
 * and subsequently, a link that redirects to a route where the user can update and confirm
 * their new password.
 * 
 * @param url the website's base url.
 * @param userId the user Id from the database.
 * @param redis a redis instance.
 * @returns a link that redirects to a route where the user can update their password.
 */
 export const forgotPasswordLink = async (url: string, userId: string, redis: Redis) => {
  const id = uuidv4();
  await redis.set(`${redisPrefices.forgotPassword}${id}`, userId, 'ex', 60*10);
  return `${url}/change-password/${id}`;
}