const express = require('express');
const upload  = require('multer')({ dest: './views/assets/' });
const router = express.Router();

const usersController = require('../controller/users')

router.get('/data', usersController.get);
router.post('/',upload.single('picture'), usersController.post);

module.exports = router;