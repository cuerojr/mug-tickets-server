const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares = require('../middlewares/validationMiddleware');
const CacheMiddleware = require('../middlewares/cacheMiddleware');

const validationsMiddlewares = new ValidationsMiddlewares();

const { AdminController } = require('../controllers/adminController');
const adminController = new AdminController();

router.get('/',
    [
        validationsMiddlewares.validateJWT,
        CacheMiddleware()
    ], 
    adminController.getAll);

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
    adminController.create);

router.get('/:id', [
        validationsMiddlewares.validateJWT,
    ], 
    adminController.get);

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
    adminController.update);

router.delete('/:id',
    [
        validationsMiddlewares.validateJWT
    ], 
    adminController.delete);

module.exports = router;