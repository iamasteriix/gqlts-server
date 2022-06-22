import { Request, Response } from 'express';
import { User } from '../entity/User';
import { redis } from '../redis';
import { redisPrefices } from '../redis';


export const confirmEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = await redis.get(id);

  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    await redis.del(id);
    res.send('Email confirmed!');
  } else {
    res.send('Invalid');
  }
}

export const changePassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const resetId = `${redisPrefices.forgotPassword}${id}`
  const userId = await redis.get(resetId);

  if (userId) {
    res.send('Will enter here html file to add new password');
    await redis.del(resetId);
  }
  else res.send("We're not sure we recognize you...");
}