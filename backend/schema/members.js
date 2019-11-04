const { logger } = require('../log/logger');
const { default_dbname, get, insert, update, del } = require('../database');
const { convertID } = require('./schema');

module.exports = {
    query: {
        allMembers: '[Member]',
        'getMemberByID(id: ID!)': 'Member',
        'getMemberByUsername(username: String!)': 'Member',
        'getMembersBySchool(school: School!)': '[Member]',
    },
    mutation: {
        'addMember(input: MemberInput)': 'Member',
        'updateMemberByID(id: ID!, input: MemberUpdate)': 'Member',
        'updateMemberByUsername(username: String!, input: MemberUpdate)': 'Member',
        'deleteMemberByID(id: ID!)': 'Boolean',
        'deleteMemberByUsername(username: String!)': 'Boolean',
    },
    typeDef: `
        type Member {
            _id: ID!
            firstname: String!
            lastname: String!
            username: String!
            password: String!
            join: String!
            email: String!
            phone: String
            school: School!
        }

        input MemberInput {
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
            let copy = JSON.parse(JSON.stringify(args.input));
            copy['join'] = new Date();
            const existing = await get(default_dbname, 'members', {username: copy.username});
            if(existing.length != 0) {
                logger.info(`Add new member from addMember request rejected because username already exists, username: ${copy.username}`);
                return null;
            }
            await insert(default_dbname, 'members', [copy]);
            logger.info(`Added new member from addMember request, member: ${JSON.stringify(copy)}`)
            return copy;
        },
        updateMemberByID: async function(parent, args, context, info) {
            let memberID = args.id;
            let newData = args.input;
            const convertion = convertID(memberID);
            if(!convertion.valid) {
                logger.info(`Update member from updateMemberByID request failed since ID type is not valid, id: ${memberID}`);
                return null;
            }
            if(newData) {
                logger.info(`Updated member from updateMemberByID request, id: ${memberID}, newData: ${JSON.stringify(newData)}`);
                const result = await update(default_dbname, 'members', {_id: convertion.id}, {$set: newData});
                return result.value;
            }
            logger.info(`Update member from updateMemberByID request skipped since newData is not provided`);
            return null;
        },
        updateMemberByUsername: async function(parent, args, context, info) {
            let username = args.username;
            let newData = args.input;
            if(newData) {
                logger.info(`Updated member from updateMemberByUsername request, username: ${username}, newData: ${JSON.stringify(newData)}`);
                const result =  await update(default_dbname, 'members', {username: username}, {$set: newData});
                return result.value;
            }
            logger.info(`Update member from updateMemberByUsername request skipped since newData is not provided`);
            return null;
        },
        deleteMemberByID: async function(parent, args, context, info) {
            let memberID = args.id;
            const convertion = convertID(memberID);
            if(!convertion.valid) {
                logger.info(`Delete member from deleteMemberByID request failed since ID type is not valid, id: ${memberID}`);
                return null;
            }
            const result = await del(default_dbname, 'members', {_id: convertion.id});
            if(result.result.n === 0) {
                logger.info(`Delete member from deleteMemberByID request, id: ${memberID}, result: false`);
                return false;
            }
            logger.info(`Delete member from deleteMemberByID request, id: ${memberID}, result: true`);
            return true;
        },
        deleteMemberByUsername: async function(parent, args, context, info) {
            let username = args.username;
            const result = await del(default_dbname, 'members', {username: username});
            if(result.result.n === 0) {
                logger.info(`Delete member from deleteMemberByUsername request, username: ${username}, result: false`);
                return false;
            }
            logger.info(`Delete member from deleteMemberByUsername request, username: ${username}, result: true`);
            return true;
        },
    },
    queryResolver: {
        allMembers: async function(parent, args, context, info){
            const result = await get(default_dbname, 'members', {});
            logger.info(`Return result from allMembers request, ${JSON.stringify(result)}`);
            return result;
        },
        getMemberByID: async function(parent, args, context, info) {
            const memberID = args.id;
            const convertion = convertID(memberID);
            if(!convertion.valid) {
                logger.log(`Get member by getMemberByID request failed since ID type is not valid, id: ${memberID}`);
                return null;
            }
            const result = await get(default_dbname, 'members', {_id: convertion.id});
            if(result.length > 1) {
                dblogger.error(`Duplicated ID in database: ${memberID}, # of duplicates: ${result.length}`);
            }
            if(result.length === 0) {
                logger.info(`Return result from getMemberByID request, ID: ${memberID}, result: null`);
                return null;
            }
            logger.info(`Return result from getMemberByID request, ID:${memberID}, result: ${JSON.stringify(result[0])}`);
            return result[0];
        },
        getMemberByUsername: async function(parent, args, context, info) {
            const username = args.username;
            const result = await get(default_dbname, 'members', {username: username});
            if(result.length > 1) {
                dblogger.error(`Duplicated usernames in database: ${username}, # of duplicates: ${result.length}`);
            }
            if(result.length === 0) {
                logger.info(`Return result from getMemberByUsername request, username: ${username}, result: null`);
                return null;
            }
            logger.info(`Return result from getMemberByUsername request, username:${username}, result: ${JSON.stringify(result[0])}`);
            return result[0];
        },
        getMembersBySchool: async function(parent, args, context, info) {
            const school = args.school;
            const result = await get(default_dbname, 'members', {school: school});
            logger.info(`Return result from getMembersBySchool request, result: ${JSON.stringify(result)}, size: ${result.length}`);
            return result;
        }
    }
}