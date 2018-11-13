const User = require('../models/user');
/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.get = function get(req, res, next) {
    User.find(function (err, user) {
        if (err) throw err;
        res.send({success: true, data: user});
    });
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.post = function (req, res, next) {
    const payload = {
        name: req.body.name,
        username: req.body.username,
        status: req.body.status
    };

    if (req.file) {
        payload.picture = req.file.filename;
    }
    const user = new User(payload);
    user.save(function (err, usr) {
        if (err) throw err;

        return res.send({success: true, data: usr});
    });
};