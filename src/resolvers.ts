// idk what to tell you, these are resolvers
export const resolvers = {
    Query: {
      hello: (_: any, { name }: any) => `Hello ${name || "World"}`,
    },
}