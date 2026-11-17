const { body, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array()
        });
    };
};

const loginValidation = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .trim()
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
];

const userValidation = [
    body('fullname')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Full name must be between 3 and 50 characters'),
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .matches(/^\S+$/).withMessage('Username cannot contain spaces')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['admin', 'author']).withMessage('Role must be either admin or author')
];

const userUpdateValidation = [
    body('fullname')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Full name must be between 3 and 50 characters'),
    body('password')
        .optional({ checkFalsy: true })
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['admin', 'author']).withMessage('Role must be either admin or author')
];

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Category name must be between 3 and 50 characters'),
    body('description')
        .optional({ checkFalsy: true })
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters long')
];

const articleValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('content')
        .trim()
        .notEmpty().withMessage('Content is required'),
    body('category')
        .notEmpty().withMessage('Category is required')
];

const commentValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required'),
    body('email')
        .trim()
        .isEmail().withMessage('Valid email is required'),
    body('content')
        .trim()
        .notEmpty().withMessage('Comment content is required')
];

module.exports = {
    validate,
    loginValidation,
    userValidation,
    userUpdateValidation,
    categoryValidation,
    articleValidation,
    commentValidation
};
