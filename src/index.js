const { GraphQLServer } = require('graphql-yoga');

/**
 * "typeDefs" defines GraphQL schema. '!' denotes that the field can never be null. Type
 * definitions from the application schema.
 */ 
const typeDefs = `
    type Query {
        info: String!
    }
`
/**
 * Resolvers object is the actual implementation of the GraphQL schema. It mirrors the 
 * Query, Mutation and Subscription types and their fields from the application schema.
 */
const resolvers = {
    Query: {
        info: () => null,
    }
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
    typeDefs,
    resolvers,
});

/**
 * Start the server
 */
server.start(() => console.log(`Server is running on http://localhost:4000`));