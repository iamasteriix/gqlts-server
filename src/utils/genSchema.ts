import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { addResolversToSchema, mergeSchemas } from "@graphql-tools/schema";
import { readdirSync } from "fs";
import { GraphQLSchema } from "graphql";
import { join } from "path";


/**
 * This method retrieves the schema documents and adds their type definitions.
 * 
 * @returns `GraphqlSchema` the merged graphql schema.
 */
export const genSchema = async () => {
  // create schema
  const schemas: GraphQLSchema[] = [];
  const folders = readdirSync(join(__dirname, '../modules/user'));

  for (const folder of folders) {
    const typeDefs = await loadSchema(`../modules/user/${folder}/schema.gql`, {
      cwd: __dirname,
      assumeValid: true,
      assumeValidSDL: true,
      loaders: [new GraphQLFileLoader()]
    });
    const { resolvers } = require(`../modules/user/${folder}/resolvers`);
    const typeDefsWithResolvers = addResolversToSchema(typeDefs, resolvers);
    schemas.push(typeDefsWithResolvers);
  };

  return mergeSchemas({ schemas });
}