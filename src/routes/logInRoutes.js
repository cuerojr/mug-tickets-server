const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

import { LogInController } from '../controllers/logInController';
const logInController = new LogInController();

router.post('/', 
    [
        check('password', 'Password is required').not().isEmpty(), 
        check('email', 'Email is required').isEmail(),        
        validationsMiddlewares.validateFields
    ],
    logInController.login);

router.post('/google', 
    [
        check('token', 'Google token is required').not().isEmpty(), 
        validationsMiddlewares.validateFields
    ],
    logInController.googleSignIn);

module.exports = router;