import { Router } from 'express';
const router = Router();

import { check } from 'express-validator';
import {ValidationsMiddlewares} from '../middlewares/validationMiddleware.js';
import { EventController } from '../controllers/eventController.js';
import * as CacheMiddleware from '../middlewares/cacheMiddleware.js';

const validationsMiddlewares = new ValidationsMiddlewares();

const eventController = new EventController();

/**
 * @swagger
 * components:
 *  schemas:
 *      Event:
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

// Route: GET /api/events
// Middleware: CacheMiddleware (cache middleware)
// Controller: eventController.getAll
/**
 * @swagger
 * /api/events/:
 *  get:
 *      summary: get all events
 *      tags: [Event]
 *      responses:
 *          200:
 *              description: all events
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Event'
 *      
 */     
router.get('/', 
    [
        //validationsMiddlewares.validateIfAdmin,
        //CacheMiddleware()
    ], 
    eventController.getAll);

// Route: GET /api/events/query
// Middleware: validateIfAdmin (Admin validation middleware)
// Controller: eventController.filter
router.get('/query', [
        validationsMiddlewares.validateIfAdmin,
    ], 
    eventController.filter);

// Route: POST /api/events
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: eventController.create
/**
 * @swagger
 * /api/events:
 *  post:
 *      summary: post new event
 *      tags: [Event]
 *      responses:
 *          200:
 *              description: all events
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *      
 */  
router.post('/', 
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
        check('creatorId', 'Creator id is required').not().isEmpty(),
        check('eventType', 'Event type is required').not().isEmpty(),
        check('title', 'Show title is required').not().isEmpty(),
        check('description', 'Show description is required').not().isEmpty(),
        check('address', 'Show address is required').not().isEmpty(),
        //check('dates', 'Dates array is required and must be an array').isArray({ min: 1 }),
        //check('dates.*.date', 'Date is required for each ticket').not().isEmpty(), 
        validationsMiddlewares.validateFields,
    ],
    eventController.create);

// Route: GET /api/events/:id
// Middleware: validateIfAdmin (Admin validation middleware)
// Controller: eventController.get
/**
 * @swagger
 * /api/events/{id}:
 *  get:
 *      summary: get event
 *      tags: [Event]
 *      responses:
 *          200:
 *              description: all events
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Event'
 *      
 */  
router.get('/:id', [
        //validationsMiddlewares.validateIfAdmin,
    ], 
    eventController.get);

// Route: PUT /api/events/:id
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: eventController.update
/**
 * @swagger
 * /api/events/{id}:
 *  put:
 *      summary: update event
 *      tags: [Event]
 *      responses:
 *          200:
 *              description: all events
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Event'
 *      
 */  
router.put('/:id', 
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
        check('eventType', 'Event type is required').not().isEmpty(),
        //check('ticketPurchaseDeadline', 'Ticket purchase deadline is required').not().isEmpty(),
        check('title', 'Show title is required').not().isEmpty(),
        check('description', 'Show description is required').not().isEmpty(),
        check('address', 'Show address is required').not().isEmpty(),
        //check('date', 'Show date is required').not().isEmpty(),  
        validationsMiddlewares.validateFields
    ], 
    eventController.update);

// Route: DELETE /api/events/:id
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: eventController.delete
/**
 * @swagger
 * /api/events/{id}:
 *  delete:
 *      summary: delete event
 *      tags: [Event]
 *      responses:
 *          200:
 *              description: all events
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Event'
 *      
 */  
router.delete('/:id',
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
    ], 
    eventController.delete);

export {
    router
};