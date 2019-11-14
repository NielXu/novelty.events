const { logger } = require('../log/logger');
const { default_dbname, get, insert, update, del } = require('../database');
const { convertID, _, constructPayload } = require('./tools');

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
        'updateEventByID(id: ID!)': 'EventPayload',
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
            chiefID: [ID!]!
            place: String!
            cost: Float!
            description: String
            adminHelpers: [ID]
            memberHelpers: [ID]
            initialSize: Int
            collaborate: [String]
        }

        type EventPayload {
            status: String!
            code: Int!
            message: String
            data: [Card]
            affected: Int
        }

        input EventInput {
            date: String!
            time: String!
            title: String!
            level: EventLevel!
            public: Boolean!
            chiefID: [ID!]!
            place: String!
            cost: Float!
            description: String
            adminHelpers: [ID]
            memberHelpers: [ID]
            initialSize: Int
            collaborate: [String]
        }
    `,
    mutationResolver: {},
    queryResolver: {},
}