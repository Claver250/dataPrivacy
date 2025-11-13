const express = require('express');
const passport = require('passport')
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/loginUser', authController.loginUser);
router.post('/google', authController.googleLogin);

module.exports = router;