const MongoClient = require('mongodb').MongoClient;
const uuid4 = require('uuid/v4');
const { dblogger } = require('./log/logger');

HOST = process.env.HOST? process.env.HOST : 'localhost';
PORT = process.env.PORT? process.env.PORT : '27017';
const URL = `mongodb://${HOST}:${PORT}`;
let db_instance;
const default_dbname = "novelty";

async function init() {
    dblogger.info('Initializing database');
    dblogger.info(`Attempting to connect: ${URL}`);
    db_instance = await MongoClient.connect(URL, {useUnifiedTopology: true, useNewUrlParser: true});
    dblogger.info('Successfully connected to mongodb');
    if(process.env.NODE_ENV === 'dev') {
        dblogger.info('[dev] Deleting old data');
        let delete_n = 0;
        const m =  await del(default_dbname, 'members', {});
        delete_n += m.result.n;
        const a = await del(default_dbname, 'admins', {});
        delete_n += a.result.n
        const c = await del(default_dbname, 'cards', {});
        delete_n += c.result.n;
        const e = await del(default_dbname, 'events', {});
        delete_n += e.result.n;
        dblogger.info(`[dev] Deleted size: ${delete_n}`);
    }
}

/**
 * Delete data in the database, all the records that match the
 * query will be deleted therefore use this safely. It is async
 * function and will return the result
 * 
 * @param {String} db_name Name of the database
 * @param {String} collec_name Name of the collection
 * @param {String} query Query for deleting
 */
async function del(db_name, collec_name, query) {
    const db = db_instance.db(db_name);
    try {
        return await db.collection(collec_name).deleteMany(query);
    }
    catch(e) {
        dblogger.error(`Error occurred when deleting from database, query: ${JSON.stringify(query)}, error: ${e}`);
    }
}

/**
 * Get data from database, all the records that match the
 * query will be returned as a array. It is async function
 * and will return the result
 * 
 * @param {String} db_name Name of the database
 * @param {String} collec_name Name of the collection
 * @param {Object} query Query for selecting
 */
async function get(db_name, collec_name, query) {
    const db = db_instance.db(db_name);
    try {
        return await db.collection(collec_name).find(query).toArray();
    }
    catch(e) {
        dblogger.error(`Error occurred when reading from database, query: ${JSON.stringify(query)}, error: ${e}`);
    }
}

/**
 * Insert data to the database. One extra field `uid` will
 * be added if uid is set to true, it is an unique identifier generated
 * by uuid4.
 * 
 * @param {String} db_name Name of the database
 * @param {String} collec_name Name of the collection
 * @param {Array} docs Array of objects to be inserted
 * @param {String} uid Add uid to database, default is true
 */
async function insert(db_name, collec_name, docs, uid=true) {
    if(uid) {
        for(let i=0;i<docs.length;i++) {
            docs[i].uid = uuid4();
        }
    }
    const db = db_instance.db(db_name);
    try {
        return await db.collection(collec_name).insertMany(docs);
    }
    catch(e) {
        dblogger.error(`Error occurred when inserting to database, query: ${JSON.stringify(query)}, error: ${e}`);
    }
}

/**
 * Update the data in the database, all the records that
 * match the query will be updated therefore use this
 * safely. Return the updated document.
 * 
 * @param {String} db_name Name of the database
 * @param {String} collec_name Name of the collection
 * @param {String} query Filter for updating
 * @param {Object} update Update object
 */
async function update(db_name, collec_name, query, update, callback) {
    const db = db_instance.db(db_name);
    try {
        return await db.collection(collec_name).findOneAndUpdate(query, update, { returnOriginal: false });
    }
    catch(e) {
        dblogger.error(`Error occurred when updating in database, query: ${JSON.stringify(query)}, error: ${e}`);
    }
}

module.exports = {
    init: init,
    default_dbname: default_dbname,
    get: get,
    insert: insert,
    del: del,
    update: update,
}