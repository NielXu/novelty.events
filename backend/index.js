// const { ApolloServer } = require('apollo-server');
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const path = require('path');
const express = require('express');
const graphqlHttp = require('express-graphql');
const { logger } = require('./log/logger');
const { init } = require('./database');
const { schema: typeDefs, resolver: resolvers } = require('./schema/schema');
const app = express();
const schema = makeExecutableSchema({typeDefs: typeDefs, resolvers: resolvers});

(async () => {
    logger.info(`Setting up Express Server`);
    app.use(express.static(path.join(__dirname, 'static/')));
    app.use('/public', express.static(path.join(__dirname, 'public')));
    app.use(
        '/graphql',
        graphqlHttp({
            schema: schema,
            graphiql: true,
        })
    );
    app.get('*', (req, res, next) => {
        res.sendFile(path.join(__dirname, 'static', 'index.html'));
    })
    await init();
    app.listen(4000);
    logger.info(`Server ready at port 4000`);
})()

// logger.info(`Setting up ApolloServer`);
// const server = new ApolloServer({ typeDefs, resolvers });

// (async () => {
//     await init();
//     server.listen().then(({ url }) => {
//         logger.info(`Server ready at ${url}`);
//     })
// })()
