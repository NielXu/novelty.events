const { logger } = require('../log/logger');
const { default_dbname, get, insert, update, del } = require('../database');
const { convertID, _, constructPayload } = require('./tools');
const { copyHashPassword, verifyToken } = require('../security');

module.exports = {
    query: {
        allMembers: 'MemberPayload',
        'getMemberByID(id: ID!)': 'MemberPayload',
        'getMemberByUsername(username: String!)': 'MemberPayload',
        'getMembersBySchool(school: School!)': 'MemberPayload',
        'getMemberByToken(token: String!)': 'MemberPayload',
    },
    mutation: {
        'addMember(input: MemberInput)': 'MemberPayload',
        'updateMemberByID(id: ID!, input: MemberUpdate)': 'MemberPayload',
        'updateMemberByUsername(username: String!, input: MemberUpdate)': 'MemberPayload',
        'deleteMemberByID(id: ID!)': 'MemberPayload',
        'deleteMemberByUsername(username: String!)': 'MemberPayload',
    },
    typeDef: `
        type Member {
            _id: ID!
            number: String!
            firstname: String!
            lastname: String!
            username: String!
            password: String!
            join: String!
            email: String!
            phone: String
            school: School!
        }

        type MemberPayload {
            status: String!
            code: Int!
            message: String
            data: [Member]
            affected: Int
        }

        input MemberInput {
            number: String!
            firstname: String!
            lastname: String!
            username: String!
            password: String!
            email: String!
            phone: String
            school: School!
        }

        input MemberUpdate {
            firstname: String
            lastname: String
            username: String
            password: String
            email: String
            phone: String
            school: School
        }
    `,
    mutationResolver: {
        addMember: async function(parent, args, context, info) {
            let copy = copyHashPassword(args.input);
            copy['join'] = new Date();
            const existing = await get(default_dbname, 'members', {username: copy.username});
            if(existing.length != 0) {
                logger.info(`Add new member from addMember request rejected because username already exists, username: ${copy.username}`);
                return constructPayload('Failed', -1, _, _, "Username already exists");
            }
            await insert(default_dbname, 'members', [copy]);
            logger.info(`Added new member from addMember request, member: ${JSON.stringify(copy)}`)
            return constructPayload('Success', 0, [copy]);
        },
        updateMemberByID: async function(parent, args, context, info) {
            let memberID = args.id;
            let newData = copyHashPassword(args.input);
            const convertion = convertID(memberID);
            if(!convertion.valid) {
                logger.info(`Update member from updateMemberByID request failed since ID type is not valid, id: ${memberID}`);
                return constructPayload('Failed', -1, _, _, "Invalid ID type");
            }
            if(newData) {
                logger.info(`Updated member from updateMemberByID request, id: ${memberID}, newData: ${JSON.stringify(newData)}`);
                const result = await update(default_dbname, 'members', {_id: convertion.id}, {$set: newData});
                return constructPayload('Success', 0, [result.value]);
            }
            logger.info(`Update member from updateMemberByID request skipped since newData is not provided`);
            return constructPayload('Failed', -1, _, _, "No new data provided");
        },
        updateMemberByUsername: async function(parent, args, context, info) {
            let username = args.username;
            let newData = copyHashPassword(args.input);
            if(newData) {
                logger.info(`Updated member from updateMemberByUsername request, username: ${username}, newData: ${JSON.stringify(newData)}`);
                const result =  await update(default_dbname, 'members', {username: username}, {$set: newData});
                return constructPayload('Success', 0, [result.value]);
            }
            logger.info(`Update member from updateMemberByUsername request skipped since newData is not provided`);
            return constructPayload('Failed', -1, _, _, "No new data provided");
        },
        deleteMemberByID: async function(parent, args, context, info) {
            let memberID = args.id;
            const convertion = convertID(memberID);
            if(!convertion.valid) {
                logger.info(`Delete member from deleteMemberByID request failed since ID type is not valid, id: ${memberID}`);
                return constructPayload('Failed', -1, _, _, "Invalid ID type");
            }
            const result = await del(default_dbname, 'members', {_id: convertion.id});
            if(result.result.n === 0) {
                logger.info(`Delete member from deleteMemberByID request, id: ${memberID}, result: false`);
                return constructPayload('Success', 0, _, 0, "No data matched was deleted");
            }
            logger.info(`Delete member from deleteMemberByID request, id: ${memberID}, result: true`);
            return constructPayload('Success', 0, _, result.result.n);
        },
        deleteMemberByUsername: async function(parent, args, context, info) {
            let username = args.username;
            const result = await del(default_dbname, 'members', {username: username});
            if(result.result.n === 0) {
                logger.info(`Delete member from deleteMemberByUsername request, username: ${username}, result: false`);
                return constructPayload('Success', 0, _, 0, "No data matched was deleted");
            }
            logger.info(`Delete member from deleteMemberByUsername request, username: ${username}, result: true`);
            return constructPayload('Success', 0, _, result.result.n);
        },
    },
    queryResolver: {
        getMemberByToken: async function(parent, args, context, info) {
            const token = args.token;
            const verification = verifyToken(token);
            if(verification.valid) {
                if(verification.decoded.type !== 'members') {
                    logger.info(`Failed to return member in getMemberByToken request, given token is not members type`);
                    return constructPayload('Failed', -1, _, _, "Given token is not members type");
                }
                const result = await get(default_dbname, 'members', {username: verification.decoded.username});
                logger.info(`Return member from getMemberByToken request, username: ${verification.decoded.username}`);
                return constructPayload('Success', 0, result);
            }
            else {
                logger.info(`Failed to return member from getMemberByToken request, given token is invalid`);
                return constructPayload('Failed', -1, _, _, "Invalid token");
            }
        },
        allMembers: async function(parent, args, context, info){
            const result = await get(default_dbname, 'members', {});
            logger.info(`Return result from allMembers request, ${JSON.stringify(result)}`);
            return constructPayload('Success', 0, result, _);
        },
        getMemberByID: async function(parent, args, context, info) {
            const memberID = args.id;
            const convertion = convertID(memberID);
            if(!convertion.valid) {
                logger.info(`Get member by getMemberByID request failed since ID type is not valid, id: ${memberID}`);
                return constructPayload('Failed', -1, _, _, "Invalid ID type");
            }
            const result = await get(default_dbname, 'members', {_id: convertion.id});
            if(result.length > 1) {
                dblogger.error(`Duplicated ID in database: ${memberID}, # of duplicates: ${result.length}`);
                return constructPayload('Failed', -1, _, _, "Internal error");
            }
            if(result.length === 0) {
                logger.info(`Return result from getMemberByID request, ID: ${memberID}, result: null`);
                return constructPayload('Success', 0, []);
            }
            logger.info(`Return result from getMemberByID request, ID:${memberID}, result: ${JSON.stringify(result[0])}`);
            return constructPayload('Success', 0, result);
        },
        getMemberByUsername: async function(parent, args, context, info) {
            const username = args.username;
            const result = await get(default_dbname, 'members', {username: username});
            if(result.length > 1) {
                dblogger.error(`Duplicated usernames in database: ${username}, # of duplicates: ${result.length}`);
                return constructPayload('Failed', -1, _, _, "Internal error");
            }
            if(result.length === 0) {
                logger.info(`Return result from getMemberByUsername request, username: ${username}, result: null`);
                return constructPayload('Success', 0, []);
            }
            logger.info(`Return result from getMemberByUsername request, username:${username}, result: ${JSON.stringify(result[0])}`);
            return constructPayload('Success', 0, result);
        },
        getMembersBySchool: async function(parent, args, context, info) {
            const school = args.school;
            const result = await get(default_dbname, 'members', {school: school});
            logger.info(`Return result from getMembersBySchool request, result: ${JSON.stringify(result)}, size: ${result.length}`);
            return constructPayload('Success', 0, result);
        }
    }
}