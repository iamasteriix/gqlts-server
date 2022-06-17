import rateLimit from 'express-rate-limit';
import session from 'express-session';
import connectRedis from 'connect-redis';
import RedisRateLimitStore from 'rate-limit-redis';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import { redis, redisPrefices } from '../redis';


const RedisStore = connectRedis(session);
export const isProduction = process.env.NODE_ENV === 'production';


export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
  store: new RedisRateLimitStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => redis.call(...args)
  })
});

export const sessionOptions = session({
  store: new RedisStore({
    client: redis,
    prefix: redisPrefices.redisSessionPrefix
  }),
  name: 'gqlts-id',
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',
    httpOnly: true,
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7   // store cookie session for 7 days
  }
});

export const contextArgs: object | ContextFunction<ExpressContext, object> | undefined = ({ req }) => ({
  redis,
  url: req.protocol + '://' + req.get('host'),
  session: req.session,
  request: req
})