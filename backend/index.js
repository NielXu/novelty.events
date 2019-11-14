// const { ApolloServer } = require('apollo-server');
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const path = require('path');
const express = require('express');
const graphqlHttp = require('express-graphql');
const { logger, dblogger } = require('./log/logger');
const { init, get, default_dbname } = require('./database');
const { hashPassword, generateToken, verifyToken } = require('./security');
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
    app.post('/auth', async (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({message: 'Missing request body'});
        }
        else if(req.body.hasOwnProperty('X-Auth-Token')) {
            const veri = verifyToken(req.body['X-Auth-Token']);
            if(veri.valid) {
                return res.json({
                    message: 'Success',
                    token: req.body['X-Auth-Token'],
                    type: veri.decoded.type
                });
            }
            else {
                return res.json({message: 'Access denied, invalid token'});
            }
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
            return res.status(500).json({message: 'Server side error'});
        }
        else {
            if(result[0].password === hashPassword(password)) {
                logger.info(`Attempt to login with username: ${username}, password: ${hashPassword(password)}, type: ${type}, result: success`);
                return res.json({message: 'Success', token: generateToken(username, type), type: type});
            }
            else {
                logger.info(`Attempt to login with username: ${username}, password: ${hashPassword(password)}, type: ${type}, result: failed`);
                return res.status(401).json({message: 'Incorrect username or password'});
            }
        }
    });
    app.post('/verify', async(req, res, next) => {
        if(!req.body) {
            return res.status(400).json({message: 'Missing request body'});
        }
        else if(!req.body.hasOwnProperty('number')) {
            return res.status(400).json({message: 'Missing key {number}'});
        }
        const number = req.body.number;
        const result = await get(default_dbname, 'cards', {number: number});
        if(result.length === 0) {
            logger.info(`Verifying card failed since it does not exists, number: ${number}`);
            return res.json({message: 'Cannot find card with given number'});
        }
        if(result[0].activate) {
            logger.info(`Verifying card failed since it has been activated, number: ${number}`);
            return res.json({message: 'Card has been activated'});
        }
        logger.info(`Verifying card success, number: ${number}`);
        return res.json({message: 'Success'});
    })
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
