import {ApolloServer, gql } from 'apollo-server';

import { resolvers } from "./resolvers";
const QUERY = require('./schema.gql')

// provide schema
const typeDefs = gql`${QUERY}`
const schema = { typeDefs, resolvers }

// initialize server
const server = new ApolloServer(schema)
server.listen().then(({ url }) => {
    console.log(`server is listening at port ${url}`);
})