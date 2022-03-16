import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { resolvers } from './resolvers';


/**
 * TODO: import schema definition from gql file
 * will probably need to add package `fs`

const Query = readFileSync(require('./schema.gql'), 'utf-8');
*/

const schema = makeExecutableSchema({
    typeDefs: `
    type Query {
        hello: String
      }
      `,
    resolvers
})

// initialize server
const server = new ApolloServer({schema})
server.listen().then(({ url }) => {
    console.log(`server is listening at port ${url}`);
})