const { body } = require('express-validator');

const isNotEmpty = (field) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} is required.`);

exports.registerValidation = [
  isNotEmpty('name').isLength({ min: 2, max: 50 }).withMessage('Name must be 2 to 50 characters.'),
  isNotEmpty('email').isEmail().withMessage('Email must be valid.'),
  isNotEmpty('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Must include a special character.')
    .matches(/[A-Z]/).withMessage('Must include at least one uppercase letter.')
    .matches(/[a-zA-Z0-9]/).withMessage('Must be alphanumeric.'),
];

exports.loginValidation = [
  isNotEmpty('email').isEmail().withMessage('Email is required and must be valid.'),
  isNotEmpty('password').isLength({ min: 6 }).withMessage('Password is required.'),
];

exports.postValidation = [
  isNotEmpty('name').isLength({ min: 2, max: 50 }).withMessage('Post name must be 2 to 50 characters.'),
  isNotEmpty('content').isLength({ min: 5, max: 280 }).withMessage('Content must be 5 to 280 characters.'),
];

exports.commentValidation = [
  isNotEmpty('name').isLength({ min: 2, max: 50 }).withMessage('Comment name must be 2 to 50 characters.'),
  isNotEmpty('comment').isLength({ min: 2, max: 200 }).withMessage('Comment must be 2 to 200 characters.'),
];
