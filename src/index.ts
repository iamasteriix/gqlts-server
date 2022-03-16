import { createServer } from '@graphql-yoga/node'

// Create server

const typeDefs = /* GraphQL */ `
type Query {
  hello: String
}`

const resolvers = {
    Query: {
      hello: (_: any, { name }: any) => `Hello ${name || "World"}`,
    },
}

const schema = { typeDefs, resolvers }

const server = createServer({ schema })
server.start()