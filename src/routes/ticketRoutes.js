const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const { TicketController } = require('../controllers/ticketController');
const CacheMiddleware = require('../middlewares/cacheMiddleware');

const validationsMiddlewares = new ValidationsMiddlewares();
const ticketController = new TicketController();

// Route: GET /api/tickets
// Middleware: CacheMiddleware (Caches the response for faster subsequent requests)
// Controller: ticketController.getAll (Controller method to get all tickets)
router.get('/', [
        CacheMiddleware()
    ],
    ticketController.getAll);

// Route: GET /api/tickets/query
// Controller: ticketController.filter (Controller method to filter tickets based on query parameters)
router.get('/query', ticketController.filter);

// Route: POST /api/tickets
// Middleware: validateFields (Validates request body fields)
// Controller: ticketController.create (Controller method to create a new ticket)
router.post('/', 
    [
        //validationsMiddlewares.validateJWT,
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

// Route: GET /api/tickets/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Controller: ticketController.get (Controller method to get a specific ticket by ID)
router.get('/:id', [
        validationsMiddlewares.validateJWT,
    ], 
    ticketController.get);

// Route: PUT /api/tickets/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Middleware: validateFields (Validates request body fields)
// Controller: ticketController.update (Controller method to update a specific ticket by ID)
router.put('/:id', 
    [
        validationsMiddlewares.validateJWT,
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

// Route: DELETE /api/tickets/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Controller: ticketController.delete (Controller method to delete a specific ticket by ID)
router.delete('/:id', 
    [
        validationsMiddlewares.validateJWT
    ], 
    ticketController.delete);

module.exports = router;