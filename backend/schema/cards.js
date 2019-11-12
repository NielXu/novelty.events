const { logger } = require('../log/logger');
const { default_dbname, get, insert, update, del } = require('../database');
const { convertID, _, constructPayload } = require('./tools');

function copyActivate(input) {
    let copy = JSON.parse(JSON.stringify(input));
    copy['activate'] = false;
    return copy;
}

module.exports = {
    query: {
        allCards: 'CardPayload',
        'getCardByNumber(number: String!)': 'CardPayload',
        'getCardByUsername(username: String!)': 'CardPayload',
        'getCardByID(id: ID!)': 'CardPayload'
    },
    mutation: {
        'activateCardByNumber(number: String!, username: String)': 'CardPayload',
        'deactivateCardByNumber(number: String!)': 'CardPayload',
        'addCard(input: CardInput!)': 'CardPayload',
    },
    typeDef: `
        type Card {
            _id: ID!
            number: String!
            activate: Boolean!
            username: String
        }

        type CardPayload {
            status: String!
            code: Int!
            message: String
            data: [Card]
        }

        input CardInput {
            number: String!
            activate: Boolean
            username: String
        }
    `,
    mutationResolver: {
        addCard: async function(parent, args, context, info) {
            let copy = copyActivate(args.input);
            const existing = await get(default_dbname, 'cards', {number: copy.number});
            if(existing.length !== 0) {
                logger.info(`Add new card from addCard request rejected because card number already exists, number: ${copy.number}`);
                return constructPayload('Failed', -1, _, _, "Card number already exists");
            }
            await insert(default_dbname, 'cards', [copy]);
            logger.info(`Added new card from addCard request, card number: ${copy.number}`);
            return constructPayload('Success', 0, [copy]);
        },
        activateCardByNumber: async function(parent, args, context, info) {
            const number = args.number;
            const username = args.username;
            const pre = await get(default_dbname, 'cards', {number: number});
            if(pre.length === 0) {
                logger.info(`Failed to activate card from activateCardByNumber request, number: ${number}`);
                return constructPayload('Failed', -1, _, _, "Failed to activate, please make sure card number is correct");
            }
            else if(pre[0].activate) {
                logger.info(`Failed to activate card from activateCardByNumber request, already activated, number: ${number}`);
                return constructPayload('Failed', -1, _, _, "Failed to activate, the card has been activated");
            }
            let set = {activate: true};
            if(username) {
                set['username'] = username;
            }
            const result = await update(default_dbname, 'cards', {number: number}, {$set: set});
            logger.info(`Activate card from activateCardByNumber request, number: ${number}, username: ${username}`);
            return constructPayload('Success', 0, [result.value]);
        },
        deactivateCardByNumber: async function(parent, args, context, info) {
            const number = args.number;
            const pre = await get(default_dbname, 'cards', {number: number});
            if(pre.length === 0) {
                logger.info(`Failed to deactivate card from deactivateCardByNumber request, number: ${number}`);
                return constructPayload('Failed', -1, _, _, "Failed to deactivate, please make sure card number is correct");
            }
            else if(!pre[0].activate) {
                logger.info(`Failed to deactivate card from deactivateCardByNumber request, already deactivated, number: ${number}`);
                return constructPayload('Failed', -1, _, _, "Failed to deactivate, the card has been deactivated");
            }
            const result = await update(default_dbname, 'cards', {number: number}, {$set: {activate: false}, $unset: {username: 1}});
            logger.info(`Deactivate card from deactivateCardByNumber request, number: ${number}`);
            return constructPayload('Success', 0, [result.value]);
        }
    },
    queryResolver: {
        allCards: async function(parent, args, context, info) {
            const result = await get(default_dbname, 'cards', {});
            logger.info(`Return result from allCards request, ${JSON.stringify(result)}`);
            return constructPayload('Success', 0, result, _);
        },
        getCardByNumber: async function(parent, args, context, info) {
            const number = args.number;
            const result = await get(default_dbname, 'cards', {number: number});
            if(result.length > 1) {
                dblogger.error(`Duplicated numbers in database: ${number}, # of duplicates: ${result.length}`);
                return constructPayload('Failed', -1, _, _, "Internal error");
            }
            else if(result.length === 0) {
                logger.info(`Return result from getCardByNumber request, number: ${number}, result: null`);
                return constructPayload('Success', 0, []);
            }
            logger.info(`Return result from getCardByNumber request, number:${number}, result: ${JSON.stringify(result[0])}`);
            return constructPayload('Success', 0, result);
        },
        getCardByUsername: async function(parent, args, context, info) {
            const username = args.username;
            const result = await get(default_dbname, 'cards', {username: username});
            if(result.length > 1) {
                dblogger.error(`Duplicated numbers in database: ${username}, # of duplicates: ${result.length}`);
                return constructPayload('Failed', -1, _, _, "Internal error");
            }
            else if(result.length === 0) {
                logger.info(`Return result from getCardByUsername request, username: ${username}, result: null`);
                return constructPayload('Success', 0, []);
            }
            logger.info(`Return result from getCardByUsername request, username:${username}, result: ${JSON.stringify(result[0])}`);
            return constructPayload('Success', 0, result);
        },
        getCardByID: async function(parent, args, context, info) {
            const cardID = args.id;
            const convertion = convertID(cardID);
            if(!convertion.valid) {
                logger.info(`Get card by getCardByID request failed since ID type is not valid, id: ${cardID}`);
                return constructPayload('Failed', -1, _, _, "Invalid ID type");
            }
            const result = await get(default_dbname, 'cards', {_id: convertion.id});
            if(result.length > 1) {
                dblogger.error(`Duplicated ID in database: ${cardID}, # of duplicates: ${result.length}`);
                return constructPayload('Failed', -1, _, _, "Internal error");
            }
            if(result.length === 0) {
                logger.info(`Return result from getCardByID request, ID: ${cardID}, result: null`);
                return constructPayload('Success', 0, []);
            }
            logger.info(`Return result from getCardByID request, ID:${cardID}, result: ${JSON.stringify(result[0])}`);
            return constructPayload('Success', 0, result);
        }
    },
}