const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const isLoggedIn = require('../middleware/auth');

// Protected moderation routes for Admin and Authors
router.get('/', isLoggedIn, commentController.getAllComments);
router.put('/:id/status', isLoggedIn, commentController.updateCommentStatus);
router.delete('/:id', isLoggedIn, commentController.deleteComment);

module.exports = router;
