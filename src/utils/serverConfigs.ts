import 'dotenv/config';
import express from 'express';
import http from 'http';
import glob from 'glob';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import connectRedis from 'connect-redis';
import RedisRateLimitStore from 'rate-limit-redis';
import { ApolloServerPluginDrainHttpServer, ContextFunction } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchema } from '@graphql-tools/load';
import { join } from 'path';
import { redis, redisPrefices } from '../redis';


const RedisStore = connectRedis(session);
export const isProduction = process.env.NODE_ENV === 'production';
export const isTesting = process.env.NODE_ENV === 'test';
export const app = express();
export const httpServer = http.createServer(app);


/**
 * This function initializes the apolloserver constructor with the schema and type definitions.
 * @returns an apolloServer constructor.
 */
export const buildApolloServer = async () => {
  const pathToModules = join(__dirname, '../modules');

  const typeDefs = await loadSchema(`${pathToModules}/**/schema.gql`,
    {
      cwd: __dirname,
      assumeValid: true,
      assumeValidSDL: true,
      loaders: [new GraphQLFileLoader()]
    });
  const resolvers = glob
    .sync(`${pathToModules}/**/resolvers.?s`)
    .map(resolver => require(resolver).resolvers);

  const schemaWithResolvers = makeExecutableSchema({ typeDefs, resolvers });

  return new ApolloServer({
    schema: schemaWithResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: contextOptions,
    persistedQueries: false,
    cache: 'bounded'
  });
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

export const contextOptions: object | ContextFunction<ExpressContext, object> | undefined = ({ req }) => ({
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