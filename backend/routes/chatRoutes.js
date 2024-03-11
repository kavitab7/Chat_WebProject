const express = require('express');
const isSignIn = require('../middlewares/auth');
const { createChat, fetchChats, createGroupChat } = require('../controllers/chatController');
const router = express.Router()

router.post('/', isSignIn, createChat)
router.get('/', isSignIn, fetchChats);
router.post('/group', isSignIn, createGroupChat)

module.exports = router