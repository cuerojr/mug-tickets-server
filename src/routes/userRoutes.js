const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
import { ValidationsMiddlewares } from '../middlewares/validationMiddleware';
const validationsMiddlewares = new ValidationsMiddlewares();

import { UserController } from '../controllers/userController';
const userController = new UserController();

router.get('/',
    [
        validationsMiddlewares.validateJWT
    ], 
    userController.getAll);

router.post('/',
    [
        validationsMiddlewares.validateJWT,
        check('firstName', 'First name is required').not().isEmpty(),
        check('lastName', 'Last name is required').not().isEmpty(),
        check('dni', 'Dni is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(), 
        check('email', 'Email is required').isEmail(),  
        validationsMiddlewares.validateFields,       
    ], 
    userController.create);

router.get('/:id', userController.get);

router.put('/:id',
    [
        validationsMiddlewares.validateJWT,
        check('firstName', 'First name is required').not().isEmpty(),
        check('lastName', 'Last name is required').not().isEmpty(),
        check('dni', 'Dni is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(), 
        check('email', 'Email is required').isEmail(),
        validationsMiddlewares.validateFields,       
    ], 
    userController.update);

router.delete('/:id',
    [
        validationsMiddlewares.validateJWT
    ], 
    userController.delete);

module.exports = router;