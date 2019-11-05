// const { ApolloServer } = require('apollo-server');
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const path = require('path');
const express = require('express');
const graphqlHttp = require('express-graphql');
const { logger, dblogger } = require('./log/logger');
const { init, get, default_dbname } = require('./database');
const { hashPassword, generateToken } = require('./security');
const { schema: typeDefs, resolver: resolvers } = require('./schema/schema');
const app = express();
const schema = makeExecutableSchema({typeDefs: typeDefs, resolvers: resolvers});

(async () => {
    logger.info(`Setting up Express Server`);
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'static/')));
    app.use('/public', express.static(path.join(__dirname, 'public')));
    app.use(
        '/graphql',
        graphqlHttp({
            schema: schema,
            graphiql: true,
        })
    );
    // Handling login request
    app.post('/login', async (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({message: 'Missing request body'});
        }
        else if(!req.body.hasOwnProperty('username')) {
            return res.status(400).json({message: 'Missing key {username}'});
        }
        else if(!req.body.hasOwnProperty('password')) {
            return res.status(400).json({message: 'Missing key {password}'});
        }
        const type = req.body.hasOwnProperty('type')? req.body.type : 'members';
        if(type !== 'members' && type !== 'admins') {
            return res.status(400).json({message: 'Invalid login type'});
        }
        const username = req.body.username;
        const password = req.body.password;
        const result = await get(default_dbname, type, {username: username});
        if(result.length === 0) {
            logger.info(`Attempt to login with username: ${username}, password: ${hashPassword(password)}, type: ${type}, result: failed`);
            return res.status(401).json({message: 'Incorrect username or password'});
        }
        else if(result.length > 1) {
            logger.info(`Attempt to login with username: ${username}, password: ${hashPassword(password)}, type: ${type}, result: failed`);
            dblogger.error(`Duplicated username occurred in database, username: ${username}`);
        }
        else {
            if(result[0].password === hashPassword(password)) {
                logger.info(`Attempt to login with username: ${username}, password: ${hashPassword(password)}, type: ${type}, result: success`);
                return res.json({message: 'Success', token: generateToken(username, type)});
            }
            else {
                logger.info(`Attempt to login with username: ${username}, password: ${hashPassword(password)}, type: ${type}, result: failed`);
                return res.status(401).json({message: 'Incorrect username or password'});
            }
        }
    });
    // Catch all and return html page
    app.get('*', (req, res, next) => {
        res.sendFile(path.join(__dirname, 'static', 'index.html'));
    });
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
