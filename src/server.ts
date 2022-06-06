import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { GraphQLSchema } from 'graphql';
import { loadSchema } from '@graphql-tools/load';
import { addResolversToSchema, mergeSchemas } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'path';
import { readdirSync } from 'fs';
import { ServerDataSource } from './utils/selectConnection';
import { redis } from './redis';
import { confirmEmail } from './routes/confirmEmail';


/**
 * This is the main method that retrieves the schema documents, adds
 * the type definitions, initializes the ApolloServer and Typeorm database
 * connection and runs the express server with all the routes.
 * 
 * @returns server address and the running data-source in a key-value object.
 */
export default async function server() {
  
  // create schema
  const schemas: GraphQLSchema[] = [];
  const folders = readdirSync(join(__dirname, './modules'));

  for (const folder of folders) {
    const typeDefs = await loadSchema(`./modules/${folder}/schema.gql`, {
      cwd: __dirname,
      assumeValid: true,
      assumeValidSDL: true,
      loaders: [new GraphQLFileLoader()]
    });
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefsWithResolvers = addResolversToSchema(typeDefs, resolvers);
    schemas.push(typeDefsWithResolvers);
  };
  
  // initialize apollo-server with created schema
  const server = new ApolloServer({
    schema: mergeSchemas({ schemas }),
    context: ({ req }) => ({
      redis,
      url: req.protocol + '://' + req.get('host')
    })
  });

  // initialize database connection
  const DataSource = ServerDataSource();
  await DataSource.initialize();

  // TODO: confirm registration link and update database
  // initialize express server
  const app = express();

  app.get('/confirm/:id', confirmEmail);

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.NODE_ENV === 'test' ? 4001 : 4000
  app.listen(PORT, () => {
    console.log(`🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });

  return {
    url: `http://localhost:${PORT}${server.graphqlPath}`,
    dataSource: DataSource
  };
}