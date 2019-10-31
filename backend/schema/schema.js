const { gql } = require('apollo-server');
const logger = require('../log/logger');
const {typeDef: adminType, resolver: adminResolver, query: adminQuery} = require('./admins');
const {typeDef: memberType, resolver: memberResolver, query: memberQuery} = require('./members');

let schema = `
        type Query {
            ${parseQuery(adminQuery)}
            ${parseQuery(memberQuery)}
        }
`;
let resolver = {};
schema += adminType + "\n";
schema += memberType + "\n";
logger.info(`Using GraphQL schema: ${schema}`);
Object.assign(resolver, adminResolver, memberResolver);

function parseQuery(query) {
    let q = "";
    for(var key in query) {
        q += `${key}: ${query[key]}\n`;
    }
    return q
}

module.exports = {
    schema: gql(schema),
    resolver: {Query: resolver},
}