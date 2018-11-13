const express = require('express');
const upload  = require('multer')({ dest: './views/assets/' });
const router = express.Router();

const roomsController = require('../controller/rooms')

router.get('/data', roomsController.get);
router.post('/',upload.single('picture'), roomsController.post);

module.exports = router;