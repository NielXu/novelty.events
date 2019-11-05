const { default_dbname, get, insert, update, del } = require('../database');
const { logger, dblogger } = require('../log/logger');
const { convertID } = require('./schema');
const { hashPassword } = require('../security');

module.exports = {
    query: {
        allAdmins: '[Admin]',
        'getAdminByID(id: ID!)': 'Admin',
        'getAdminByUsername(username: String!)': 'Admin',
    },
    mutation: {
        'addAdmin(input: AdminInput)': 'Admin',
        'updateAdminByID(id: ID!, input: AdminUpdate)': 'Admin',
        'updateAdminByUsername(username: String!, input: AdminUpdate)': 'Admin',
        'deleteAdminByID(id: ID!)': 'Boolean',
        'deleteAdminByUsername(username: String!)': 'Boolean'
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
            let newAdmin = args.input;
            const existing = await get(default_dbname, 'admins', {username: newAdmin.username});
            if(existing.length != 0) {
                logger.info(`Add new admin from addAdmin request rejected because username already exists, username: ${newAdmin.username}`);
                return null;
            }
            await insert(default_dbname, 'admins', [newAdmin]);
            logger.info(`Added new admin from addAdmin request, admin: ${JSON.stringify(newAdmin)}`)
            return newAdmin;
        },
        updateAdminByID: async function(parent, args, context, info) {
            let adminID = args.id;
            let newData = args.input;
            if(newData) {
                const convertion = convertID(adminID);
                if(convertion.valid) {
                    logger.info(`Updated admin from updateAdminByID request, id: ${adminID}, newData: ${JSON.stringify(newData)}`);
                    const result = await update(default_dbname, 'admins', {_id: convertion.id}, {$set: newData});
                    return result.value;
                }
                logger.info(`Update admin from updateAdminByID failed since ID type is not valid, id: ${adminID}`);
                return null;
            }
            logger.info(`Update admin from updateAdminByID request skipped since newData is not provided`);
            return null;
        },
        updateAdminByUsername: async function(parent, args, context, info) {
            let username = args.username;
            let newData = args.input;
            if(newData) {
                logger.info(`Updated admin from updateAdminByUsername request, username: ${username}, newData: ${JSON.stringify(newData)}`);
                const result =  await update(default_dbname, 'admins', {username: username}, {$set: newData});
                return result.value;
            }
            logger.info(`Update admin from updateAdminByUsername request skipped since newData is not provided`);
            return null;
        },
        deleteAdminByID: async function(parent, args, context, info) {
            let adminID = args.id;
            const convertion = convertID(adminID);
            if(!convertion.valid) {
                logger.info(`Delete admin from deleteAdminByID request failed since ID type is not valid, id: ${adminID}`)
                return null;
            }
            const result = await del(default_dbname, 'admins', {_id: convertion.id});
            if(result.result.n === 0) {
                logger.info(`Delete admin from deleteAdminByID request, id: ${adminID}, result: false`);
                return false;
            }
            logger.info(`Delete admin from deleteAdminByID request, id: ${adminID}, result: true`);
            return true;
        },
        deleteAdminByUsername: async function(parent, args, context, info) {
            let username = args.username;
            const result = await del(default_dbname, 'admins', {username: username});
            if(result.result.n === 0) {
                logger.info(`Delete admin from deleteAdminByUsername request, username: ${username}, result: false`);
                return false;
            }
            logger.info(`Delete admin from deleteAdminByUsername request, username: ${username}, result: true`);
            return true;
        }
    },
    queryResolver: {
        getAdminByID: async function(parent, args, context, info) {
            const adminID = args.id;
            const convertion = convertID(adminID);
            if(!convertion.valid) {
                logger.info(`Get Admin by getAdminByID request failed since ID type is not valid, id: ${adminID}`);
                return null;
            }
            const result = await get(default_dbname, 'admins', {_id: convertion.id});
            if(result.length > 1) {
                dblogger.error(`Duplicated ID in database: ${adminID}, # of duplicates: ${result.length}`);
            }
            if(result.length === 0) {
                logger.info(`Return result from getAdminByID request, ID: ${adminID}, result: null`);
                return null;
            }
            logger.info(`Return result from getAdminByID request, ID:${adminID}, result: ${JSON.stringify(result[0])}`);
            return result[0];
        },
        getAdminByUsername: async function(parent, args, context, info) {
            const username = args.username;
            const result = await get(default_dbname, 'admins', {username: username});
            if(result.length > 1) {
                dblogger.error(`Duplicated usernames in database: ${username}, # of duplicates: ${result.length}`);
            }
            if(result.length === 0) {
                logger.info(`Return result from getAdminByUsername request, username: ${username}, result: null`);
                return null;
            }
            logger.info(`Return result from getAdminByUsername request, username:${username}, result: ${JSON.stringify(result[0])}`);
            return result[0];
        },
        allAdmins: async function(parent, args, context, info) {
            const result = await get(default_dbname, 'admins', {});
            logger.info(`Return result from allAdmins request, ${JSON.stringify(result)}`);
            return result;
        }
    }
}