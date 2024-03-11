const express = require('express');
const isSignIn = require('../middlewares/auth');
const { allMessages, sendMessage } = require('../controllers/messageController');
const router = express.Router()

router.post('/', isSignIn, sendMessage)
router.get('/:chatId', isSignIn, allMessages);

module.exports = router