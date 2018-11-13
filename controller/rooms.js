const rooms = require('../models/room');
/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.get = function get(req, res, next) {
    rooms.find(function (err, data) {
        if (err) throw err;
        res.send({success: true, data});
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
        participants: req.body.participants,
        picture: req.body.picture
    };

    if (req.file) {
        payload.picture = req.file.filename;
    }
console.log(payload,req.file);
    const room = new rooms(payload);
    room.save(function (err,data) {
        if (err) throw err;

        return res.send({success: true, data});
    });
};