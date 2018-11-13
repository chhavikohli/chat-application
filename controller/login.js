const User = require('../models/user');
const jwt = require('jsonwebtoken');
/**
 * Post function to get user id and password
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.post = function (req, res, next) {
      const payload = req.body;
     User.findOne({username: payload.username}, function (err, user) {
        if (user) {
            jwt.sign({user}, 'secretkey', (err, token) => {
                if (err) throw err;
                return res.send({success:true, token ,user});
            })
        }
        else{
            return res.send({success:false});
        }
    });
};


