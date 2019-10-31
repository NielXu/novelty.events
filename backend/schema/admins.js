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
        addAdmin: function(parent, args, context, info) {
            let newAdmin = args.input;
            insert(default_dbname, 'admins', [newAdmin], function(err, result) {
                if(err) {
                    logger.error(`Error occurred when inserting ${JSON.stringify(newAdmin)} in database, error: ${err}`);
                }
                logger.info(`Added new admin to the database ${JSON.stringify(newAdmin)}`)
                return newAdmin;
            });
        },
    },
    queryResolver: {
        getAdmin: (parent, args, context, info) => {
            const adminID = args.id;
            get(default_dbname, 'admins', {_id: ObjectID(adminID)}, function(err, result) {
                if(err) {
                    logger.error(`Error occurred when getting admin with ID ${adminID} from database, error: ${err}`);
                }
                if(result.length > 1) {
                    logger.error(`Duplicated ID in database: ${adminID}, # of duplicates: ${result.length}`);
                }
                if(result.length === 0) {
                    return {}
                }
                logger.info(`Return result from getAdmin request, ${JSON.stringify(result[0])}`);
                return result[0];
            });
        },
        allAdmins: (parent, args, context, info) => {
            get(default_dbname, 'admins', {}, function(err, result) {
                if(err) {
                    logger.error(`Error occurred when getting all admins from database, error: ${err}`)
                }
                logger.info(`Return result from allAdmins request, ${JSON.stringify(result)}`);
                return result;
            })
        }
    }
}