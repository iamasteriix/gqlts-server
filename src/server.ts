import 'dotenv/config';
import 'reflect-metadata';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { auth } from 'express-openid-connect';
import { genSchema } from './utils/genSchema';
import { ServerDataSource } from './utils/selectConnection';
import { changePassword, confirmEmail } from './routes/emailCallbacks';
import { authConfig, contextArgs, isProduction, limiter, sessionOptions } from './utils/serverConfigs';
import { isAuthenticated } from './routes/auth';


/**
 * This is the main method. It initializes the ApolloServer and Typeorm database
 * connection and runs the express server with all the routes.
 * 
 * @returns server address and the running data-source in a key-value object.
 */
export default async function server() {

  const PORT = process.env.NODE_ENV === 'test' ? 4001 : 4000;
  const app = express();
  const httpServer = http.createServer(app);
  const DataSource = ServerDataSource();

  if (!isProduction) {
    app.set('trust proxy', true);
    console.log('set trust proxy for development environment.');
  }
  
  app.use(cors());
  app.use(limiter);
  app.use(sessionOptions);
  app.use(auth(authConfig));

  app.get('/', isAuthenticated);
  app.get('/confirm/:id', confirmEmail);
  app.get('/change-password/:id', changePassword)

  const server = new ApolloServer({
    schema: await genSchema(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: contextArgs
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