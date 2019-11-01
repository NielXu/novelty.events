const { gql } = require('apollo-server');
const { logger } = require('../log/logger');
// Admins
const {
    typeDef: adminType,
    query: adminQuery,
    queryResolver: adminResolver,
    mutation: adminMutation,
    mutationResolver: adminMutationResolver
} = require('./admins');
// Members
const {typeDef: memberType,
    query: memberQuery,
    queryResolver: memberResolver,
    mutation: memberMutation,
    mutationResolver: memberMutationResolver
} = require('./members');
// Others
const {typeDef: othersType,
    query: othersQuery,
    queryResolver: othersResolver,
    mutation: othersMutation,
    mutationResolver: othersMutationResolver
} = require('./others');

let schema = `
        type Query {
            ${parseQuery(adminQuery)}
            ${parseQuery(memberQuery)}
            ${parseQuery(othersQuery)}
        }

        type Mutation {
            ${parseQuery(adminMutation)}
            ${parseQuery(memberMutation)}
            ${parseQuery(othersMutation)}
        }
`;
let queryResolver = {}, mutationResolver = {};
schema += adminType + "\n";
schema += memberType + "\n";
schema += othersType + "\n";
logger.info(`Using GraphQL schema: ${schema}`);
Object.assign(
    queryResolver,
    adminResolver,
    memberResolver,
    othersResolver,
);
Object.assign(
    mutationResolver,
    adminMutationResolver,
    memberMutationResolver,
    othersMutationResolver,
)

function parseQuery(query) {
    let q = "";
    for(var key in query) {
        q += `${key}: ${query[key]}\n`;
    }
    return q
}

module.exports = {
    schema: gql(schema),
    resolver: {Query: queryResolver, Mutation: mutationResolver},
}