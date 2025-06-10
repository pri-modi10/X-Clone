const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middlewares/validationMiddleware');
const { registerValidation, loginValidation } = require('../middlewares/validators');
const { 
    register,
    login,
    getUser,
    logout,
} = require('../controllers/authController');

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/user', getUser);
router.post('/logout', logout);

module.exports = router;
