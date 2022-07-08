const getDecodedData = require('../middleware/get-data-jwt');

module.exports = (req, res, next) => {
    const decoded = getDecodedData(req.headers.authorization);
    if (decoded.isAdmin) {
        next()
    } else {
        return res.status(401).json({
            message: 'Unauthorized, you must be an admin!'
        }) 
    }
};