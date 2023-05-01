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
        check('purchaser.purchaserFirstName', 'Purchaser first name is required').not().isEmpty(),
        check('purchaser.purchaserLastName', 'Purchaser last name is required').not().isEmpty(),
        check('purchaser.purchaserId', 'Purchaser id is required').not().isEmpty(),
        check('attendee.attendeeFirstName', 'Attendee first name is required').not().isEmpty(),
        check('attendee.attendeeLastName', 'Attendee last name is required').not().isEmpty(),
        check('attendee.attendeeDni', 'Attendee dni is required').not().isEmpty(),        
        validationsMiddlewares.validateFields
    ],
    ticketController.create);

router.get('/:id', ticketController.get);

router.put('/:id', 
    [
        check('event', 'event is required').not().isEmpty(),
        check('purchaser.purchaserFirstName', 'Purchaser first name is required').not().isEmpty(),
        check('purchaser.purchaserLastName', 'Purchaser last name is required').not().isEmpty(),
        check('purchaser.purchaserId', 'Purchaser id is required').not().isEmpty(),
        check('attendee.attendeeFirstName', 'Attendee first name is required').not().isEmpty(),
        check('attendee.attendeeLastName', 'Attendee last name is required').not().isEmpty(),
        check('attendee.attendeeDni', 'Attendee dni is required').not().isEmpty(),        
        validationsMiddlewares.validateFields 
    ], 
    ticketController.update);

router.delete('/:id', ticketController.delete);

module.exports = router;