const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

const UserController = require('../controllers/userController');
const userController = new UserController();

router.get('/', userController.getAll);

router.post('/',
    [
        check('firstName', 'firstName is required').not().isEmpty(),
        check('lastName', 'lastName is required').not().isEmpty(),
        check('dni', 'DNI is required').not().isEmpty(),
        check('password', 'password is required').not().isEmpty(), 
        check('email', 'email is required').not().isEmpty(),  
        validationsMiddlewares.validateFields,       
    ]
, userController.create);

router.get('/:id', userController.get);

router.put('/:id',
    [
        check('firstName', 'firstName is required').not().isEmpty(),
        check('lastName', 'lastName is required').not().isEmpty(),
        check('dni', 'DNI is required').not().isEmpty(), 
        validationsMiddlewares.validateFields,       
    ]
, userController.update);

router.delete('/:id', userController.delete);

module.exports = router;