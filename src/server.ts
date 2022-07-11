import 'dotenv/config';
import 'reflect-metadata';
import cors from 'cors';
// import { auth } from 'express-openid-connect';
import { ServerDataSource } from './utils/selectConnection';
import { changePassword, confirmEmail } from './routes/emailCallbacks';
// import { isAuthenticated } from './routes/auth';
import {
  app,
  httpServer,
  buildApolloServer,
  isProduction,
  isTesting,
  limiter,
  sessionOptions
} from './utils/serverConfigs';


/**
 * This is the main method. It initializes the ApolloServer and Typeorm database
 * connection and runs the express server with all the routes.
 * 
 * @returns server address and the running data-source in a key-value object.
 */
export default async function server() {

  const PORT = isProduction ? process.env.PORT : isTesting ? 4001 : 4000;
  const DataSource = ServerDataSource();
  const server = await buildApolloServer();


  if (!isProduction) {
    app.set('trust proxy', true);
    console.log('set trust proxy for development environment.');
  }
  
  app.use(cors());
  app.use(limiter);
  app.use(sessionOptions);
  // app.use(auth(authConfig));

  // app.get('/', isAuthenticated);
  app.get('/confirm/:id', confirmEmail);
  app.get('/change-password/:id', changePassword)

  await DataSource.initialize();
  if (isProduction) await DataSource.runMigrations();
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