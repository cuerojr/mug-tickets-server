import { Router } from 'express';
const router = Router();

import { check } from 'express-validator';
import { ValidationsMiddlewares }  from '../middlewares/validationMiddleware.js';
import { TicketController } from '../controllers/ticketController.js';
import * as CacheMiddleware from '../middlewares/cacheMiddleware.js';

const validationsMiddlewares = new ValidationsMiddlewares();
const ticketController = new TicketController();

/**
 * @swagger
 * components:
 *  schemas:
 *      Ticket:
 *          type: object
 *          properties:
 *              eventType:
 *                  type: string
 *              ticketsAvailableOnline:
 *                  type: number
 *              ticketPurchaseDeadline:
 *                  type: string
 *              hasLimitedPlaces:
 *                  type: boolean
 *              title:
 *                  type: string
 *              description:
 *                  type: string
 *              address:
 *                  type: string
 *              dates:
 *                  type: array
 *              price:
 *                  type: number
 *              purchasedTicketsList:
 *                  type: array
 *              ticketsTypeList:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/TicketsTypeList'
 *              createdDate:
 *                  type: string
 *              ticketsPurchased:
 *                  type: number
 *              eventId:
 *                  type: string
 *      TicketsTypeList: 
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *              eventId:
 *                  type: string
 *              price:
 *                  type: number
 *              quantity:
 *                  type: number
 *              date:
 *                  type: string
 *              type:
 *                  type: string
 *              ticketsAvailableOnline:
 *                  type: number
 *              ticketsPurchased:
 *                  type: number
 *              ticketPurchaseDeadline:
 *                  type: string
 *              isActive:
 *                  type: boolean
 *              isAbono:
 *                  type: boolean
 *              createdDate:
 *                  type: string
 *              __v:
 *                  type: number
 *          
 */

// Route: GET /api/tickets
// Middleware: CacheMiddleware (Caches the response for faster subsequent requests)
// Controller: ticketController.getAll (Controller method to get all tickets)
/**
 * @swagger
 * /api/tickets/:
 *  get:
 *      summary: get all tickets
 *      tags: [Ticket]
 *      responses:
 *          200:
 *              description: all tickets
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Ticket'
 *      
 */   
router.get('/', [
        //CacheMiddleware()
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
    // validationsMiddlewares.validateJWT,
    check('tickets', 'Tickets array is required and must be an array').isArray({ min: 1 }),
    check('tickets.*.event', 'Event is required for each ticket').not().isEmpty(),
    check('tickets.*.purchaser.purchaserFirstName', 'Purchaser first name is required for each ticket').not().isEmpty(),
    check('tickets.*.purchaser.purchaserLastName', 'Purchaser last name is required for each ticket').not().isEmpty(),
    check('tickets.*.attendee.attendeeFirstName', 'Attendee first name is required for each ticket').not().isEmpty(),
    check('tickets.*.attendee.attendeeLastName', 'Attendee last name is required for each ticket').not().isEmpty(),
    check('tickets.*.attendee.attendeeDni', 'Attendee dni is required for each ticket').not().isEmpty(),
    //validationsMiddlewares.validateFields
  ],
  ticketController.create);


// Route: GET /api/tickets/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Controller: ticketController.get (Controller method to get a specific ticket by ID)
router.get('/:id', [
        //validationsMiddlewares.validateJWT,
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
        check('purchaser.purchaserEmail', 'Purchaser email is required').not().isEmpty(),
        check('purchaser.purchaserDni', 'Purchaser dni is required').not().isEmpty(),
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

// Route: UPDATE /api/tickets/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Controller: ticketController.validate (Controller method to validate a specific ticket by ID)
router.put('/validate/:id', 
    [
        //validationsMiddlewares.validateJWT,
        //validationsMiddlewares.validateIfAdmin,
    ], 
    ticketController.validate);

// Route: UPDATE /api/tickets/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Controller: ticketController.unvalidate (Controller method to unvalidate a specific ticket by ID)
router.put('/unvalidate/:id', 
    [
        //validationsMiddlewares.validateJWT,
        //validationsMiddlewares.validateIfAdmin,
    ], 
    ticketController.validate);

export {
    router
};