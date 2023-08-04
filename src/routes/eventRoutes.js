const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const { EventController } = require('../controllers/eventController');
const CacheMiddleware = require('../middlewares/cacheMiddleware');

const validationsMiddlewares = new ValidationsMiddlewares();

const eventController = new EventController();

router.get('/', 
    [
        validationsMiddlewares.validateIfAdmin,
        CacheMiddleware()
    ], 
    eventController.getAll);

router.get('/query', [
        validationsMiddlewares.validateIfAdmin,
    ], 
    eventController.filter);

router.post('/', 
    [
        validationsMiddlewares.validateIfAdmin,
        validationsMiddlewares.validateJWT,
        check('eventType', 'Event type is required').not().isEmpty(),
        check('ticketPurchaseDeadline', 'Ticket purchase deadline is required').not().isEmpty(),
        check('title', 'Show title is required').not().isEmpty(),
        check('description', 'Show description is required').not().isEmpty(),
        check('address', 'Show address is required').not().isEmpty(),
        check('date', 'Show date is required').not().isEmpty(),  
        validationsMiddlewares.validateFields,
    ],
    eventController.create);

router.get('/:id', [
        validationsMiddlewares.validateIfAdmin,
    ], 
    eventController.get);

router.put('/:id', 
    [
        validationsMiddlewares.validateIfAdmin,
        validationsMiddlewares.validateJWT,
        check('eventType', 'Event type is required').not().isEmpty(),
        check('ticketPurchaseDeadline', 'Ticket purchase deadline is required').not().isEmpty(),
        check('title', 'Show title is required').not().isEmpty(),
        check('description', 'Show description is required').not().isEmpty(),
        check('address', 'Show address is required').not().isEmpty(),
        check('date', 'Show date is required').not().isEmpty(),  
        validationsMiddlewares.validateFields
    ], 
    eventController.update);

router.delete('/:id',
    [
        validationsMiddlewares.validateIfAdmin,
        validationsMiddlewares.validateJWT
    ], 
    eventController.delete);

module.exports = router;