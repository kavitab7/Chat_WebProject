const express = require('express');
const isSignIn = require('../middlewares/auth');
const { registerUser, loginUser, allUsers, UsersProfilePhoto } = require('../controllers/userController');
const ExpressFormidable = require('express-formidable');

const router = express.Router();
router.get('/all-users', isSignIn, allUsers)
router.get('/profile-photo/:uid', UsersProfilePhoto)
router.post('/register', ExpressFormidable(), registerUser)
router.post('/login', loginUser);

module.exports = router;