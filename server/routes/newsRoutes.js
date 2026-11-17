const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const commentController = require('../controllers/commentController');
const isLoggedIn = require('../middleware/auth');
const upload = require('../middleware/multer');
const { validate, articleValidation, commentValidation } = require('../middleware/validation');

// Public route to get news (supports optional auth for "mine" parameter)
const optionalAuth = (req, res, next) => {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const tokenData = jwt.verify(token, process.env.JWT_SECRET);
            req.user = tokenData;
        } catch (e) {
            // ignore invalid token for optional auth
        }
    }
    next();
};

router.get('/', optionalAuth, newsController.getNews);
router.get('/:id', newsController.getNewsById);
router.post('/', isLoggedIn, upload.single('image'), validate(articleValidation), newsController.createNews);
router.put('/:id', isLoggedIn, upload.single('image'), newsController.updateNews);
router.delete('/:id', isLoggedIn, newsController.deleteNews);

// Public comment posting on article
router.post('/:articleId/comments', validate(commentValidation), commentController.addComment);

module.exports = router;
