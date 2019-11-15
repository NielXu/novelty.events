const argv = require('yargs').argv;
const reader = require('js-yaml');
const path = require('path');
const fs = require('fs');
const { copyHashPassword } = require('./security');
const { deleteDev, insert, default_dbname, get } = require('./database');
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
            const data = read_data('events')
            for(var i=0;i<data.length;i++) {
                const event = data[i];
                const chiefs = event.chiefs;
                const memberHelpers = event.memberHelpers? event.memberHelpers : null;
                const adminHelpers = event.adminHelpers? event.adminHelpers : null;
                let chiefsData = [], memberHelpersData = [], adminHelpersData = [];
                for(var j=0;j<chiefs.length;j++) {
                    const result = await get(default_dbname, 'admins', {username: chiefs[j]});
                    chiefsData.push(result[0]);
                }
                if(event.memberHelpers) {
                    for(var k=0;k<memberHelpers.length;k++) {
                        const result = await get(default_dbname, 'members', {username: memberHelpers[k]});
                        memberHelpersData.push(result[0]);
                    }
                    event['memberHelpers'] = memberHelpersData;
                }
                if(event.adminHelpers) {
                    for(var q=0;q<adminHelpers.length;q++) {
                        const result = await get(default_dbname, 'admins', {username: adminHelpers[q]});
                        adminHelpersData.push(result[0]);
                    }
                    event['adminHelpers'] = adminHelpersData;
                }
                event['chiefs'] = chiefsData;
            }
            logger.info(`[dev] Inserting events mock data ...`);
            await insert(default_dbname, 'events', data);
        }
    }
}