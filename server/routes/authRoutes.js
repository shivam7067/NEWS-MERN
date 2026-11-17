const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isLoggedIn = require('../middleware/auth');
const { validate, loginValidation } = require('../middleware/validation');

router.post('/login', validate(loginValidation), authController.login);
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);
router.get('/me', isLoggedIn, authController.getMe);

module.exports = router;
