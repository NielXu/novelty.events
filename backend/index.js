const { ApolloServer } = require('apollo-server');
const logger = require('./log/logger');
const { init } = require('./database');
const { schema: typeDefs, resolver: resolvers } = require('./schema/schema');

logger.info(`Setting up ApolloServer`);
const server = new ApolloServer({ typeDefs, resolvers });

init(function() {
    server.listen().then(({ url }) => {
        logger.info(`Server ready at ${url}`);
    })
})