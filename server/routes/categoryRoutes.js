const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const isLoggedIn = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { validate, categoryValidation } = require('../middleware/validation');

// Public route to get categories
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin-only management routes
router.post('/', isLoggedIn, isAdmin, validate(categoryValidation), categoryController.createCategory);
router.put('/:id', isLoggedIn, isAdmin, validate(categoryValidation), categoryController.updateCategory);
router.delete('/:id', isLoggedIn, isAdmin, categoryController.deleteCategory);

module.exports = router;
