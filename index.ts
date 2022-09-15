
const { ApolloServer, gql } = require('apollo-server');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');


import { schema } from "./src/schema";
import { context } from "./src/context"

export const server = new ApolloServer({
    schema,
    context,
});


const port = 3709;
// The `listen` method launches a web server.
server.listen({port}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
