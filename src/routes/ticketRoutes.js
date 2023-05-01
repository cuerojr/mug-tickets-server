const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

const TicketController = require('../controllers/ticketController');
const ticketController = new TicketController();

router.get('/', ticketController.getAll);

router.post('/', 
    [
        check('event', 'event is required').not().isEmpty(),
        check('purchaser.purchaserFirstName', 'purchaser First Name is required').not().isEmpty(),
        check('purchaser.purchaserLastName', 'purchaser Last Name is required').not().isEmpty(),
        check('purchaser.purchaserId', 'purchaser id is required').not().isEmpty(),
        check('attendee.attendeeFirstName', 'attendee first Name is required').not().isEmpty(),
        check('attendee.attendeeLastName', 'attendee last Name is required').not().isEmpty(),
        check('attendee.attendeeDni', 'attendee dni is required').not().isEmpty(),        
        validationsMiddlewares.validateFields
    ],
    ticketController.create);

router.get('/:id', ticketController.get);

router.put('/:id', 
    [
        check('event', 'event is required').not().isEmpty(),
        check('purchaser.purchaserFirstName', 'purchaser First Name is required').not().isEmpty(),
        check('purchaser.purchaserLastName', 'purchaser Last Name is required').not().isEmpty(),
        check('purchaser.purchaserId', 'purchaser id is required').not().isEmpty(),
        check('attendee.attendeeFirstName', 'attendee first Name is required').not().isEmpty(),
        check('attendee.attendeeLastName', 'attendee last Name is required').not().isEmpty(),
        check('attendee.attendeeDni', 'attendee dni is required').not().isEmpty(),        
        validationsMiddlewares.validateFields 
    ], 
    ticketController.update);

router.delete('/:id', ticketController.delete);

module.exports = router;