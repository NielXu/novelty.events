const ObjectID = require('mongodb').ObjectID;

module.exports = {
    /**
     * Try to convert the given id to the ObjectID in mongodb,
     * return valid true and the result if it is valid,
     * return valid false otherwise.
     * 
     * @param {String} id The ID that will be converted to ObjectID in mongodb
    */
    convertID: function(id) {
        let result;
        try {
            result = ObjectID(id);
            return {valid: true, id: result};
        }
        catch(e) {
            return {valid: false};
        }
    },

    constructPayload: function(status, code, data, affected, message) {
        let resp = {
            status: status,
            code: code,
        }
        if(data) {
            resp['data'] = data;
        }
        if(message) {
            resp['message'] = message;
        }
        if(affected) {
            resp['affected'] = affected;
        }
        return resp;
    },

    _: undefined,
}