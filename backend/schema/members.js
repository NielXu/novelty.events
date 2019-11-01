const { logger } = require('../log/logger');
const { default_dbname, get, insert } = require('../database');
const ObjectID = require('mongodb').ObjectID;

module.exports = {
    query: {
        allMembers: '[Member]',
        'getMemberByID(id: ID!)': 'Member',
        'getMemberByUsername(username: String!)': 'Member',
        'getMembersBySchool(school: School!)': '[Member]',
    },
    mutation: {
        'addMember(input: MemberInput)': 'Member',
    },
    typeDef: `
        type Member {
            id: ID!
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
        }
    },
    queryResolver: {
        allMembers: async function(parent, args, context, info){
            const result = await get(default_dbname, 'members', {});
            logger.info(`Return result from allMembers request, ${JSON.stringify(result)}`);
            return result;
        },
        getMemberByID: async function(parent, args, context, info) {
            const memberID = args.id;
            const result = await get(default_dbname, 'members', {_id: ObjectID(memberID)});
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