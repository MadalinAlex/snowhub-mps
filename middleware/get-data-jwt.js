const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/keys').JWT_KEY

module.exports = function getDecodedData(reqHeaderAuthorization) {
    let decoded = null;
    try {
        decoded = jwt.verify(reqHeaderAuthorization.split(" ")[1], jwtSecret);
        return decoded;
    } catch (error) {
        return null;
    }
}