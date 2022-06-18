import 'dotenv/config';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import connectRedis from 'connect-redis';
import RedisRateLimitStore from 'rate-limit-redis';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import { redis, redisPrefices } from '../redis';
import { addResolversToSchema, mergeSchemas } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchema } from '@graphql-tools/load';
import { join } from 'path';
import { readdirSync } from 'fs';
import { GraphQLSchema } from 'graphql';


const RedisStore = connectRedis(session);
export const isProduction = process.env.NODE_ENV === 'production';


/**
 * This method retrieves the schema documents and adds their type definitions.
 * 
 * @returns `GraphqlSchema` the merged graphql schema.
 */
 export const genSchema = async () => {
  // create schema
  const schemas: GraphQLSchema[] = [];
  const folders = readdirSync(join(__dirname, '../modules/user'));

  for (const folder of folders) {
    const typeDefs = await loadSchema(`../modules/user/${folder}/schema.gql`, {
      cwd: __dirname,
      assumeValid: true,
      assumeValidSDL: true,
      loaders: [new GraphQLFileLoader()]
    });
    const { resolvers } = require(`../modules/user/${folder}/resolvers`);
    const typeDefsWithResolvers = addResolversToSchema(typeDefs, resolvers);
    schemas.push(typeDefsWithResolvers);
  };

  return mergeSchemas({ schemas });
}

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
});

export const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET as string,
  baseURL: 'http://localhost:4000',
  clientID: process.env.CLIENT_ID as string,
  issuerBaseURL: process.env.ISSUER_BASE_URL as string
};