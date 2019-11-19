const jwt = require('jsonwebtoken');
const sha256 = require('sha256');

// Random secret token, this will be changed and keep private in the future
SECRET = 'Lz91!j&kb91AFkj0SAFonin21el1';

function generateToken(username, type) {
    return jwt.sign(
        {
            username: username,
            type: type
        },
        SECRET,
        {
            expiresIn: 1800
        }
    );
}

function verifyToken(token) {
    let decoded;
    try{
        decoded = jwt.verify(token, SECRET);
    }
    catch(e) {
        return {valid: false}
    }
    return {valid: true, decoded: decoded}
}

function hashPassword(pass) {
    return sha256(pass);
}

function copyHashPassword(origin) {
    if(origin.password) {
        let copy = JSON.parse(JSON.stringify(origin));
        let password = copy.password;
        copy['password'] = hashPassword(password);
        return copy;
    }
    return origin;
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
    hashPassword: hashPassword,
    copyHashPassword: copyHashPassword,
}
