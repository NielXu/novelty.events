const { default_dbname, get, insert, update, del } = require('../database');
const { logger, dblogger } = require('../log/logger');
const { convertID, _, constructPayload } = require('./tools');
const { copyHashPassword, verifyToken } = require('../security');

module.exports = {
    query: {
        allAdmins: 'AdminPayload',
        'getAdminByID(id: ID!)': 'AdminPayload',
        'getAdminByUsername(username: String!)': 'AdminPayload',
        'getAdminByToken(token: String!)': 'AdminPayload',
    },
    mutation: {
        'addAdmin(input: AdminInput)': 'AdminPayload',
        'updateAdminByID(id: ID!, input: AdminUpdate)': 'AdminPayload',
        'updateAdminByUsername(username: String!, input: AdminUpdate)': 'AdminPayload',
        'deleteAdminByID(id: ID!)': 'AdminPayload',
        'deleteAdminByUsername(username: String!)': 'AdminPayload'
    },
    typeDef: `
        type Admin {
            _id: ID!
            firstname: String!
            lastname: String!
            username: String!
            password: String!
            email: String!
            phone: String
            type: AdminType!
        }

        type AdminPayload {
            status: String!
            code: Int!
            message: String
            data: [Admin]
            affected: Int
        }

        input AdminInput {
            firstname: String!
            lastname: String!
            username: String!
            password: String!
            email: String!
            phone: String
        }

        input AdminUpdate {
            firstname: String
            lastname: String
            username: String
            password: String
            email: String
            phone: String
            type: AdminType
        }
    `,
    mutationResolver: {
        addAdmin: async function(parent, args, context, info) {
            let newAdmin = copyHashPassword(args.input);
            const existing = await get(default_dbname, 'admins', {username: newAdmin.username});
            if(existing.length != 0) {
                logger.info(`Add new admin from addAdmin request rejected because username already exists, username: ${newAdmin.username}`);
                return constructPayload('Failed', -1, _, _, "Username already exists");
            }
            await insert(default_dbname, 'admins', [newAdmin]);
            logger.info(`Added new admin from addAdmin request, admin: ${JSON.stringify(newAdmin)}`)
            return constructPayload('Success', 0, [newAdmin]);
        },
        updateAdminByID: async function(parent, args, context, info) {
            let adminID = args.id;
            let newData = copyHashPassword(args.input);
            if(newData) {
                const convertion = convertID(adminID);
                if(convertion.valid) {
                    logger.info(`Updated admin from updateAdminByID request, id: ${adminID}, newData: ${JSON.stringify(newData)}`);
                    const result = await update(default_dbname, 'admins', {_id: convertion.id}, {$set: newData});
                    return constructPayload('Success', 0, [result.value]);
                }
                logger.info(`Update admin from updateAdminByID failed since ID type is not valid, id: ${adminID}`);
                return constructPayload('Failed', -1, _, _, "Invalid ID type");
            }
            logger.info(`Update admin from updateAdminByID request skipped since newData is not provided`);
            return constructPayload('Failed', -1, _, _, "No new data provided");
        },
        updateAdminByUsername: async function(parent, args, context, info) {
            let username = args.username;
            let newData = copyHashPassword(args.input);
            if(newData) {
                logger.info(`Updated admin from updateAdminByUsername request, username: ${username}, newData: ${JSON.stringify(newData)}`);
                const result =  await update(default_dbname, 'admins', {username: username}, {$set: newData});
                return constructPayload('Success', 0, [result.value])
            }
            logger.info(`Update admin from updateAdminByUsername request skipped since newData is not provided`);
            return constructPayload('Failed', -1, _, _, "No new data provided");
        },
        deleteAdminByID: async function(parent, args, context, info) {
            let adminID = args.id;
            const convertion = convertID(adminID);
            if(!convertion.valid) {
                logger.info(`Delete admin from deleteAdminByID request failed since ID type is not valid, id: ${adminID}`)
                return constructPayload('Failed', -1, _, _, "Invalid ID type");
            }
            const result = await del(default_dbname, 'admins', {_id: convertion.id});
            if(result.result.n === 0) {
                logger.info(`Delete admin from deleteAdminByID request, id: ${adminID}, result: false`);
                return constructPayload('Success', 0, _, 0, "No data matched was deleted");
            }
            logger.info(`Delete admin from deleteAdminByID request, id: ${adminID}, result: true`);
            return constructPayload('Success', 0, _, result.result.n);
        },
        deleteAdminByUsername: async function(parent, args, context, info) {
            let username = args.username;
            const result = await del(default_dbname, 'admins', {username: username});
            if(result.result.n === 0) {
                logger.info(`Delete admin from deleteAdminByUsername request, username: ${username}, result: false`);
                return constructPayload('Success', 0, _, 0, "No data matched was deleted");
            }
            logger.info(`Delete admin from deleteAdminByUsername request, username: ${username}, result: true`);
            return constructPayload('Success', 0, _, result.result.n);
        }
    },
    queryResolver: {
        getAdminByToken: async function(parent, args, context, info) {
            const token = args.token;
            const verification = verifyToken(token);
            if(verification.valid) {
                if(verification.decoded.type !== 'admins') {
                    logger.info(`Failed to return admin in getAdminByToken request, given token is not admins type`);
                    return constructPayload('Failed', -1, _, _, "Given token is not admins type");
                }
                const result = await get(default_dbname, 'admins', {username: verification.decoded.username});
                logger.info(`Return admin from getAdminByToken request, username: ${verification.decoded.username}`);
                return constructPayload('Success', 0, result);
            }
            else {
                logger.info(`Failed to return admin from getAdminByToken request, given token is invalid`);
                return constructPayload('Failed', -1, _, _, "Invalid token");
            }
        },
        getAdminByID: async function(parent, args, context, info) {
            const adminID = args.id;
            const convertion = convertID(adminID);
            if(!convertion.valid) {
                logger.info(`Get Admin by getAdminByID request failed since ID type is not valid, id: ${adminID}`);
                return constructPayload('Failed', -1, _, _, "Invalid ID type");
            }
            const result = await get(default_dbname, 'admins', {_id: convertion.id});
            if(result.length > 1) {
                dblogger.error(`Duplicated ID in database: ${adminID}, # of duplicates: ${result.length}`);
                return constructPayload('Failed', -1, _, _, "Internal error");
            }
            if(result.length === 0) {
                logger.info(`Return result from getAdminByID request, ID: ${adminID}, result: null`);
                return constructPayload('Success', 0, []);
            }
            logger.info(`Return result from getAdminByID request, ID:${adminID}, result: ${JSON.stringify(result[0])}`);
            return constructPayload('Success', 0, result);
        },
        getAdminByUsername: async function(parent, args, context, info) {
            const username = args.username;
            const result = await get(default_dbname, 'admins', {username: username});
            if(result.length > 1) {
                dblogger.error(`Duplicated usernames in database: ${username}, # of duplicates: ${result.length}`);
                return constructPayload('Failed', -1, _, _, "Internal error");
            }
            if(result.length === 0) {
                logger.info(`Return result from getAdminByUsername request, username: ${username}, result: null`);
                return constructPayload('Success', 0, []);
            }
            logger.info(`Return result from getAdminByUsername request, username:${username}, result: ${JSON.stringify(result[0])}`);
            return constructPayload('Success', 0, result);
        },
        allAdmins: async function(parent, args, context, info) {
            const result = await get(default_dbname, 'admins', {});
            logger.info(`Return result from allAdmins request, ${JSON.stringify(result)}`);
            return constructPayload('Success', 0, result);
        }
    }
}