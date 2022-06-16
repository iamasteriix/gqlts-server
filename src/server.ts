import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import session from 'express-session';
import http from 'http';
import connectRedis from 'connect-redis';
import { genSchema } from './utils/genSchema';
import { ServerDataSource } from './utils/selectConnection';
import { redis, sessionPrefices } from './redis';
import { confirmEmail } from './routes/confirmEmail/confirmEmail';
import cors from 'cors';


/**
 * This is the main method. It initializes the ApolloServer and Typeorm database
 * connection and runs the express server with all the routes.
 * 
 * @returns server address and the running data-source in a key-value object.
 */
export default async function server() {

  const isProduction = process.env.NODE_ENV === 'production';
  const PORT = process.env.NODE_ENV === 'test' ? 4001 : 4000;
  const app = express();
  const httpServer = http.createServer(app);
  const RedisStore = connectRedis(session);
  const DataSource = ServerDataSource();

  if (!isProduction) {
    app.set('trust proxy', true);
    console.log('set trust proxy for development environment.');
  }
  
  app.use(
    session({
      store: new RedisStore({
        client: redis,
        prefix: sessionPrefices.redisSessionPrefix
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
    })
  );

  app.use(cors());

  app.get('/confirm/:id', confirmEmail);

  const server = new ApolloServer({
    schema: await genSchema(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => ({
      redis,
      url: req.protocol + '://' + req.get('host'),
      session: req.session,
      request: req
    })
  });

  await DataSource.initialize();
  await server.start();
  server.applyMiddleware({ app });

  await new Promise<void>(resolve =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}/`);

  return {
    graphqlPath: `http://localhost:${PORT}${server.graphqlPath}/`,
    url: `http://localhost:${PORT}`,
    dataSource: DataSource
  };
}