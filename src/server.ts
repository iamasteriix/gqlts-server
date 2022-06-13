import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { genSchema } from './utils/genSchema';
import { ServerDataSource } from './utils/selectConnection';
import { redis } from './redis';
import { confirmEmail } from './routes/confirmEmail/confirmEmail';
import cors from 'cors';


/**
 * This is the main method. It initializes the ApolloServer and Typeorm database
 * connection and runs the express server with all the routes.
 * 
 * @returns server address and the running data-source in a key-value object.
 */
export default async function server() {

  // initialize database connection
  const DataSource = ServerDataSource();
  await DataSource.initialize();

  // initialize apollo-server with created schema
  const server = new ApolloServer({
    schema: await genSchema(),
    context: ({ req }) => ({
      redis,
      url: req.protocol + '://' + req.get('host'),
      session: req.session
    })
  });

  const app = express();  // initialize express server
  const RedisStore = connectRedis(session); // initialize redis store for cookies
  
  app.use(
    cors(),
    session({
      name: 'gqlts-id',
      store: new RedisStore({ client: redis }),
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7   // store cookie session for 7 days
      }
    })
  );

  app.get('/confirm/:id', confirmEmail);

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.NODE_ENV === 'test' ? 4001 : 4000;
  app.listen(PORT, () => {
    console.log(`🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}/`);
  });

  return {
    graphqlPath: `http://localhost:${PORT}${server.graphqlPath}/`,
    url: `http://localhost:${PORT}`,
    dataSource: DataSource
  };
}