import { ApolloServer } from 'apollo-server';
import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

import { resolvers } from './resolvers';
import { ServerDataSource } from './utils/selectConnection';


export default async function server() {
  // load schema  
  const typeDefs = await loadSchema('schema.gql', {
      cwd: __dirname,
      assumeValid: true,
      assumeValidSDL: true,
      skipGraphQLImport: true,
      loaders: [new GraphQLFileLoader()]
  })

  const server = new ApolloServer({ typeDefs, resolvers });

  // initialize database connection
  await ServerDataSource().initialize();

  // start server
  const app = await server.listen({
    port: process.env.NODE_ENV === 'test' ? 4001 : 4000
  });
  console.log(`🚀  Server ready at ${app.url}`);

  return app;
}