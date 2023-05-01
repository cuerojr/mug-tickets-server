const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

const EventController = require('../controllers/eventController');
const eventController = new EventController();

router.get('/', eventController.getAll);

router.post('/', 
    [
        check('eventType', 'event type is required').not().isEmpty(),
        check('ticketPurchaseDeadline', 'ticket Purchase Deadline is required').not().isEmpty(),
        check('showInfo.title', 'purchaser Last Name is required').not().isEmpty(),
        check('showInfo.address', 'purchaser id is required').not().isEmpty(),
        check('showInfo.date', 'attendee first Name is required').not().isEmpty(),  
        validationsMiddlewares.validateFields
    ],
    eventController.create);

router.get('/:id', eventController.get);

router.put('/:id', 
    [
        check('eventType', 'event type is required').not().isEmpty(),
        check('ticketPurchaseDeadline', 'ticket Purchase Deadline is required').not().isEmpty(),
        check('showInfo.title', 'purchaser Last Name is required').not().isEmpty(),
        check('showInfo.address', 'purchaser id is required').not().isEmpty(),
        check('showInfo.date', 'attendee first Name is required').not().isEmpty(),  
        validationsMiddlewares.validateFields
    ], 
    eventController.update);

router.delete('/:id', eventController.delete);

module.exports = router;