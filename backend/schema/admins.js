const { default_dbname, get, insert } = require('../database');
const ObjectID = require('mongodb').ObjectID;
const uuid4 = require('uuid/v4');
const logger = require('../log/logger');

module.exports = {
    query: {
        allAdmins: '[Admin]',
        'getAdmin(id: ID!)': 'Admin'
    },
    mutation: {
        'addAdmin(input: AdminInput)': 'Admin'  
    },
    typeDef: `
        type Admin {
            id: ID!
            firstname: String!
            lastname: String!
            username: String!
            password: String!
            email: String!
            phone: String
            type: AdminType!
        }

        input AdminInput {
            firstname: String!
            lastname: String!
            username: String!
            password: String!
            email: String!
            phone: String
        }
    `,
    mutationResolver: {
        addAdmin: async function(parent, args, context, info) {
            let newAdmin = args.input;
            await insert(default_dbname, 'admins', [newAdmin]);
            logger.info(`Added new admin to the database ${JSON.stringify(newAdmin)}`)
            return newAdmin;
        },
    },
    queryResolver: {
        getAdmin: async function(parent, args, context, info) {
            const adminID = args.id;
            const result = await get(default_dbname, 'admins', {_id: ObjectID(adminID)});
            if(result.length > 1) {
                logger.error(`Duplicated ID in database: ${adminID}, # of duplicates: ${result.length}`);
            }
            if(result.length === 0) {
                logger.info(`Return result from getAdmin request, null`);
                return null;
            }
            logger.info(`Return result from getAdmin request, ${JSON.stringify(result[0])}`);
            return result[0];
        },
        allAdmins: async function(parent, args, context, info) {
            const result = await get(default_dbname, 'admins', {});
            logger.info(`Return result from allAdmins request, ${JSON.stringify(result)}`);
            return result;
        }
    }
}