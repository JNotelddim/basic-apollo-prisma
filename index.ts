import { PrismaClient } from '@prisma/client'

const { ApolloServer, gql } = require('apollo-server');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

const prisma = new PrismaClient()

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
//const typeDefs = gql`
//  type User {
//    id: String
//    email: String
//    name: String
//  }
//
//  type Profile {
//    id: String
//    bio: String
//    user: User
//  }
//
//  type Post {
//    id: String
//    createdAt String
//    updatedAt: String
//    title: String
//    content: String
//    published: Boolean
//    author: User
//  }
//
//  type Query {
//    users: [User]
//    posts: [Post]
//  }
//`;


// const resolvers = {
//   Query: {
//     users: async () => {
//          const allUsers = await prisma.user.findMany({
//             include: {
//               posts: true,
//               profile: true,
//             },
//           });
//         return allUsers;
//     },
//     posts: async () => {
//         const allPosts = await prisma.book.findMany({
//             include: {
//                 user: true,
//             }
//         });
//         return allPosts;
//     },
//   },
// };


import { schema } from "./schema";
export const server = new ApolloServer({
    schema,
});


const port = 3709;
// The `listen` method launches a web server.
server.listen({port}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
