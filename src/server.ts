import { ApolloServer } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { loadSchema } from '@graphql-tools/load';
import { addResolversToSchema, mergeSchemas } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'path';
import { readdirSync } from 'fs';
import { ServerDataSource } from './utils/selectConnection';
import Redis = require('ioredis');


/**
 * Main method that calls the schema and builds the apollo-server.
 * 
 * @returns apollo-server app object.
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

  // initialize redis instance
  const redis = new Redis();
  
  // initialize apollo-server with created schema
  const server = new ApolloServer({
    schema: mergeSchemas({ schemas }),
    context: ({ req }) => ({
      redis,
      url: req + '://' + req.get('host')
    })
  });

  // TODO: confirm registration link and update database

  // initialize database connection
  await ServerDataSource().initialize();

  // start server
  const app = await server.listen({
    port: process.env.NODE_ENV === 'test' ? 4001 : 4000
  });
  console.log(`🚀  Server ready at ${app.url}`);

  return app;
}