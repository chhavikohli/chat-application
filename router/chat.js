const express = require('express');
const multer = require('multer');
const path = require('path');
/*const upload = require('multer')({dest: './views/assets/'});*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/assets//')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});
const upload = multer({ storage: storage });
const router = express.Router();
const chatsController = require('../controller/chats');

const isAuthenticated = require('../utils/authenticate');


router.get('/', isAuthenticated, chatsController.get);
router.get('/groupChat', isAuthenticated, chatsController.getGroupChat);
router.post('/',upload.single('file'), chatsController.post);



module.exports = router;


