const { logger } = require('../log/logger');
const { default_dbname, get, insert, update, del } = require('../database');
const { convertID, _, constructPayload } = require('./tools');

function copyInput(input) {
    return JSON.parse(JSON.stringify(input));
}

async function updateChiefs(chiefs) {
    let admins = [];
    for(var i=0;i<chiefs.length;i++) {
        const id = chiefs[i];
        let conversion = convertID(id);
        if(conversion.valid) {
            const result = await get(default_dbname, 'admins', {_id: conversion.id});
            if(result.length === 0) {
                logger.info(`Failed to create event, admin ID not found: ${id}`);
                return {valid: false, result: constructPayload('Failed', -1, _, _, `Admin not found with ID: ${id}`)};
            }
            else {
                admins.push(result[0]);
            }
        }
        else {
            logger.info(`Failed to create event, invalid admin ID: ${id}`);
            return {valid: false, result: constructPayload('Failed', -1, _, _, `Invalid ID type: ${id}`)};
        }
    }
    return {valid: true, result: admins};
}

async function updateMemberHelper(memberHelpers) {
    let members = [];
    for(var i=0;i<memberHelpers.length;i++) {
        const id = memberHelpers[i];
        let conversion = convertID(id);
        if(conversion.valid) {
            const result = await get(default_dbname, 'members', {_id: conversion.id});
            if(result.length === 0) {
                logger.info(`Failed to create event, member helper ID not found: ${id}`);
                return {valid: false, result: constructPayload('Failed', -1, _, _, `Member helper not found with ID: ${id}`)};
            }
            else {
                members.push(result[0]);
            }
        }
        else {
            logger.info(`Failed to create event, invalid member helper ID: ${id}`);
            return {valid: false, result: constructPayload('Failed', -1, _, _, `Invalid ID type: ${id}`)};
        }
    }
    return {valid: true, result: members};
}

async function updateAdminHelper(adminHelpers) {
    let admins = [];
    for(var i=0;i<adminHelpers.length;i++) {
        const id = adminHelpers[i];
        let conversion = convertID(id);
        if(conversion.valid) {
            const result = await get(default_dbname, 'admins', {_id: conversion.id});
            if(result.length === 0) {
                logger.info(`Failed to create event, admin helper ID not found: ${id}`);
                return {valid: false, result: constructPayload('Failed', -1, _, _, `Admin helper not found with ID: ${id}`)};
            }
            else {
                admins.push(result[0]);
            }
        }
        else {
            logger.info(`Failed to create event, invalid admin helper ID: ${id}`);
            return {valid: false, result: constructPayload('Failed', -1, _, _, `Invalid ID type: ${id}`)};
        }
    }
    return {valid: true, result: admins};
}

module.exports = {
    query: {
        allEvents: 'EventPayload',
        getUpcomingEvent: 'EventPayload',
        'getEventByID(id: ID!)': 'EventPayload',
        'getEventBeforeDate(date: String!)': 'EventPayload',
        'getEventAfterDate(date: String!)': 'EventPayload',
        'getEventAtDate(date: String!)': 'EventPayload',
    },
    mutation: {
        'addEvent(input: EventInput)': 'EventPayload',
        'updateEventByID(id: ID!, input: EventUpdate)': 'EventPayload',
        'deleteEventByID(id: ID!)': 'EventPayload',
    },
    typeDef: `
        type Event {
            _id: ID!
            date: String!
            time: String!
            title: String!
            level: EventLevel!
            public: Boolean!
            chiefs: [Admin!]!
            place: String!
            cost: Float!
            description: String
            adminHelpers: [Admin]
            memberHelpers: [Member]
            size: Int
            collaborate: [String]
        }

        type EventPayload {
            status: String!
            code: Int!
            message: String
            data: [Event]
            affected: Int
        }

        input EventInput {
            date: String!
            time: String!
            title: String!
            level: EventLevel!
            public: Boolean!
            chiefs: [ID!]!
            place: String!
            cost: Float!
            description: String
            adminHelpers: [ID]
            memberHelpers: [ID]
            size: Int
            collaborate: [String]
        }

        input EventUpdate {
            date: String
            time: String
            title: String
            level: EventLevel
            public: Boolean
            chiefs: [ID]
            place: String
            cost: Float
            description: String
            adminHelpers: [ID]
            memberHelpers: [ID]
            size: Int
            collaborate: [String]
        }
    `,
    mutationResolver: {
        addEvent: async function(parent, args, context, info) {
            let copy = copyInput(args.input);
            const result = await updateChiefs(copy.chiefs);
            if(result.valid) {
                copy['chiefs'] = result.result;
            }
            else {
                return result.result;
            }
            if(copy.memberHelpers) {
                const memberHelpersResult = await updateMemberHelper(copy.memberHelpers);
                if(memberHelpersResult.valid) {
                    copy['memberHelpers'] = memberHelpersResult.result;
                }
                else {
                    return memberHelpersResult.result;
                }
            }
            if(copy.adminHelpers) {
                const adminHelpersResult = await updateAdminHelper(copy.adminHelpers);
                if(adminHelpersResult.valid) {
                    copy['adminHelpers'] = adminHelpersResult.result;
                }
                else {
                    return adminHelpersResult.result;
                }
            }
            await insert(default_dbname, 'events', [copy]);
            logger.info(`Successfully created event, event: ${JSON.stringify(copy)}`);
            return constructPayload('Success', 0, [copy]);
        },
        updateEventByID: async function(parent, args, context, info) {

        },
        deleteEventByID: async function(parent, args, context, info) {

        },
    },
    queryResolver: {
        allEvents: async function(parent, args, context, info) {
            const result = await get(default_dbname, 'events', {});
            logger.info(`Return result from allEvents request: ${JSON.stringify(result)}`);
            return constructPayload('Success', 0, result);
        },
        getUpcomingEvent: async function(parent, args, context, info) {

        },
        getEventByID: async function(parent, args, context, info) {

        },
        getEventBeforeDate: async function(parent, args, context, info) {

        },
        getEventAfterDate: async function(parent, args, context, info) {

        },
        getEventAtDate: async function(parent, args, context, info) {

        },
    },
}