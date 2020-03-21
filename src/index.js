const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client')

/**
 * "typeDefs" defines GraphQL schema. '!' denotes that the field can never be null. Type
 * definitions from the application schema.
 * Resolvers object is the actual implementation of the GraphQL schema. It mirrors the 
 * Query, Mutation and Subscription types and their fields from the application schema.
 * Not only root fields, but virtually all fields on the types in a GraphQL schema have
 * resolver functions. 
 * A resolver always has to be named after the corresponding field from the schema 
 * definition.
 */


const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: (root, args, context, info) => {
            return context.prisma.links()
        },
        link: (root, args, context, info) => {
            return context.prisma.links().find((link) => {
                return link.id === args.id
            })
        }
    },

    Mutation: {
        post: (root, args, context) => {      
            return context.prisma.createLink({
                description: args.description,
                url: args.url,
            });
        },
        update: (root, args, context) => {
            let index = context.prisma.links().findIndex((link) => {
                return link.id === args.id
            });
            // Prisma method to update 
            return link;
        },
        delete: (root, args, context) => {
            let index = context.prisma.links().findIndex((link) => {
                return link.id === args.id
            });
            // Prisma method to delete
            return link;
        }
    },
};


/**
 * Context: Object that gets passed through the resolve chain and every
 * resolver can read from or write to.
 */



/**
 * Schema and resolvers are bundled and passed to the GraphQLServer.
 * This tells the server what API operations are accepted and how they
 * should be resolved.
 */
const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    resolvers,
    context: { prisma }
});

/**
 * Start the server
 */
server.start(() => console.log(`Server is running on http://localhost:4000`));