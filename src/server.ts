import { ApolloServer } from 'apollo-server';
import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

import { resolvers } from './resolvers';
import { ServerDataSource } from './utils/selectConnection';


async function main() {
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
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
  
}

// run
main();

// export for testing
// export { main }