const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isLoggedIn = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { validate, userValidation, userUpdateValidation } = require('../middleware/validation');

// Public route to view author profile
router.get('/:id', userController.getUserById);

// Admin-only management routes
router.get('/', isLoggedIn, isAdmin, userController.getAllUsers);
router.post('/', isLoggedIn, isAdmin, validate(userValidation), userController.createUser);
router.put('/:id', isLoggedIn, isAdmin, validate(userUpdateValidation), userController.updateUser);
router.delete('/:id', isLoggedIn, isAdmin, userController.deleteUser);

module.exports = router;
