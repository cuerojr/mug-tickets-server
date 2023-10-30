import { Router } from 'express';
const router = Router();

import { check } from 'express-validator';
import { ValidationsMiddlewares }  from '../middlewares/validationMiddleware.js';
import { TokenController } from '../controllers/tokenController.js';
import * as CacheMiddleware from '../middlewares/cacheMiddleware.js';

const validationsMiddlewares = new ValidationsMiddlewares();
const tokenController = new TokenController();

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
    tokenController.getAll);

// Route: GET /api/tickets/query
// Controller: ticketController.filter (Controller method to filter tickets based on query parameters)
router.get('/query', tokenController.filter);

// Route: POST /api/tickets
// Middleware: validateFields (Validates request body fields)
// Controller: ticketController.create (Controller method to create a new ticket)
router.post('/',
  [
    validationsMiddlewares.validateJWT,
    check('eventId', 'Event is required').not().isEmpty(),
    check('token', 'Token is required').not().isEmpty(),
    /*check('tickets', 'Tickets array is required and must be an array').isArray({ min: 1 }),
    check('tickets.*.purchaser.purchaserFirstName', 'Purchaser first name is required for each ticket').not().isEmpty(),
    check('tickets.*.purchaser.purchaserLastName', 'Purchaser last name is required for each ticket').not().isEmpty(),
    check('tickets.*.attendee.attendeeFirstName', 'Attendee first name is required for each ticket').not().isEmpty(),
    check('tickets.*.attendee.attendeeLastName', 'Attendee last name is required for each ticket').not().isEmpty(),
    check('tickets.*.attendee.attendeeDni', 'Attendee dni is required for each ticket').not().isEmpty(),*/
    validationsMiddlewares.validateFields
  ],
  tokenController.create);


// Route: GET /api/tickets/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Controller: ticketController.get (Controller method to get a specific ticket by ID)
router.get('/:id', [
        //validationsMiddlewares.validateJWT,
    ], 
    tokenController.get);

// Route: DELETE /api/tickets/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Controller: ticketController.delete (Controller method to delete a specific ticket by ID)
router.delete('/:id', 
    [
        validationsMiddlewares.validateJWT
    ], 
    tokenController.delete);

export {
    router
};