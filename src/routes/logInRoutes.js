const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

const LogInController = require('../controllers/logInController');
const logInController = new LogInController();

router.post('/', 
    [
        check('password', 'Password is required').not().isEmpty(), 
        check('email', 'Email is required').isEmail(),        
        validationsMiddlewares.validateFields
    ],
    logInController.login);

module.exports = router;