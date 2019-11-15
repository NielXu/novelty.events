const argv = require('yargs').argv;
const reader = require('js-yaml');
const path = require('path');
const fs = require('fs');
const { copyHashPassword } = require('./security');
const { deleteDev, insert, default_dbname } = require('./database');
const { logger } = require('./log/logger');

/**
 * Read data by filename
 * 
 * @param {String} name Name of the yaml file, without .yml extension
 */
function read_data(name) {
    let content = reader.safeLoad(fs.readFileSync(path.resolve(__dirname, 'data', `${name}.yml`), 'utf8'));
    for(let i=0;i<content.length;i++) {
        if(content[i].hasOwnProperty('password')) {
            content[i] = copyHashPassword(content[i]);
        }
    }
    return content;
}

module.exports = {
    mock: async function() {
        if(argv.mock) {
            await deleteDev();
            logger.info(`[dev] Inserting admins mock data ...`);
            await insert(default_dbname, 'admins', read_data('admins'));
            logger.info(`[dev] Inserting members mock data ...`);
            await insert(default_dbname, 'members', read_data('members'));
            logger.info(`[dev] Inserting cards mock data ...`);
            await insert(default_dbname, 'cards', read_data('cards'));
            // logger.info(`[dev] Inserting events mock data`);
            // await insert(default_dbname, 'events', read_data('events'));
        }
    }
}