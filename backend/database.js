const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'webapp';

// Connection testing
async function test() {
    let conn = await MongoClient.connect(url);
    await conn.db(dbName).admin().listDatabases();
    conn.close();
}

module.exports = {
    test: test
}