const jwt= require('jsonwebtoken');
let Chat = require('../models/chat');
const filePath = require("../utils/filePath");
exports.get = function get(req, res, next) {
     let userId = req.query.users.split("|");
    Chat.find({$or: [{$and:[{senderid:userId[0]},{receiverid:userId[1]}]},{$and:[{senderid:userId[1]},{receiverid:userId[0]}]}]},function(err, chat) {
        res.send({success: true, data: chat});
    });
};
exports.getGroupChat = function get(req, res, next) {
    let userId = req.query.users.split("|");
    Chat.find({$or: [{roomId:userId[1]},{roomId:userId[0]}]},function(err, chat) {
        res.send({success: true, data: chat});
    });
}
exports.post = function (req, res, next) {
    const payload ={
        message:req.body.message,
        senderid:req.body.senderid,
        receiverid:req.body.receiverid
    }
    if (req.file) {
       payload.file = req.file.filename;
    }
    const chat = new Chat(payload);
    chat.save(function (err) {
        filePath.file =  payload.file;
        if (err) throw err;
        return res.status(201).send( chat);
    });
};