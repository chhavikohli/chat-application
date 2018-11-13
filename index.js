const express = require('express');
const socket = require('socket.io');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const users = require('./router/users');
const login = require('./router/login');
const chats = require('./router/chat');
const rooms = require('./router/rooms');
const mongoose = require('mongoose');
const filePath = require("./utils/filePath");
const app = express();

app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/chatApplication');

app.use(express.static('views'));
app.use('/users', users);
app.use('/login', login);
app.use('/chats', chats);
app.use('/rooms', rooms);

const server = app.listen('8000', function () {
    console.log('application started at 8000');
});

// Socket setup & pass server
const io = socket(server);
let onlineUsers = {};
let currentUserId = '';
let allOnlineUsers = [];
io.on('connection', (socket) => {
    socket.on('login', function (data) {
        onlineUsers[data._id] = socket.id;
        allOnlineUsers.push(data);
        socket.emit('onlineUsers', allOnlineUsers);
        socket.broadcast.emit('onUserLogin', data);
    });
    socket.on('chat', (data) => {
        console.log('---------',data,'filepath......',filePath.file);
        let result={
            senderid:data.senderid,
            receiverid:data.receiverid,
            message:data.message,
            file:filePath.file
        }
        io.to(onlineUsers[data.receiverid]).emit("chat", result);
        // io.sockets.emit('chat',result);
    })
    socket.on('typing', (data) => {

        io.to(onlineUsers[data.receiver]).emit('typing', data);

    })
    socket.on('disconnect', function () {
        var index = Object.values(onlineUsers).indexOf(socket.id);
        if (index > -1) {
            currentUserId=Object.keys(onlineUsers)[index];
            delete onlineUsers[Object.keys(onlineUsers)[index]];
        }

        allOnlineUsers.splice(allOnlineUsers.findIndex(function(i){
            return i._id === currentUserId;
        }), 1);
        socket.broadcast.emit('onDisconnect', currentUserId);
        console.log('user ' + currentUserId + ' disconnected');
    });
});
