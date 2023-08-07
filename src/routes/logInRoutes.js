const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

const { LogInController } = require('../controllers/logInController');
const logInController = new LogInController();

// Route: POST /api/login
// Middleware: Express validator middleware to check required fields (email and password)
// Middleware: validateFields (Custom middleware to validate field errors)
// Controller: logInController.login (Controller method to handle user login)
router.post('/', 
    [
        check('password', 'Password is required').not().isEmpty(), 
        check('email', 'Email is required').isEmail(),        
        validationsMiddlewares.validateFields
    ],
    logInController.login);
    
// Route: POST /api/login/google
// Middleware: Express validator middleware to check required fields (Google token)
// Middleware: validateFields (Custom middleware to validate field errors)
// Controller: logInController.googleSignIn (Controller method to handle Google sign-in)
router.post('/google', 
    [
        check('token', 'Google token is required').not().isEmpty(), 
        validationsMiddlewares.validateFields
    ],
    logInController.googleSignIn);

module.exports = router;