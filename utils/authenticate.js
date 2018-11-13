const jwt = require('jsonwebtoken');
const isAuthenticate = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== "undefined") {
        jwt.verify(bearerHeader, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            }
            else {
                next();
            }
        })
    } else {
        res.sendStatus(403);
    }
};
module.exports = isAuthenticate;