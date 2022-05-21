import { ApolloServer } from 'apollo-server';
import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

import { resolvers } from './resolvers';
import { AppDataSource } from './data-source';


async function main() {
    
  const typeDefs = await loadSchema('schema.gql', {
      cwd: __dirname,
      assumeValid: true,
      assumeValidSDL: true,
      skipGraphQLImport: true,
      loaders: [new GraphQLFileLoader()]
  })

  const server = new ApolloServer({ typeDefs, resolvers });

  // initialize database connection
  await AppDataSource.initialize();

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
    });
}

// run
main();