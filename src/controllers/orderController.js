import { response } from 'express';
import { Order } from '../models/orderModel.js';
import { User } from '../models/userModel.js';
import { Event } from '../models/eventModel.js';
import { ticketNumber } from '../helpers/dataFormatter.js';

/**
 * Controller class for handling ticket-related operations.
 */
class OrderController {    
    constructor(){}

    /**
     * Get all tickets from the database and populate their associated events.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of tickets or an error message.
     */
    async getAll(req, res = response) {
      try {
        const { id } = req.params;
        const orders = await Order.find({});
console.log(orders)
        res.status(200).json({
          ok: true,
          orders
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

    /**
     * Filter tickets based on the provided query parameters.
     *
     * @param {Object} req - Express request object containing query parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of filtered tickets or an error message.
     */
    async filter(req, res = response) {
      try {
        const tickets = await Order.find(req.query);
        
        if (tickets.length < 1) {
            return res.status(404).json({
              ok: false,
              error: 'No tickets matched your search'
            });
        } 

        tickets.forEach((item) => {
          item.ticketNumber = ticketNumber(item.ticketNumber);
        });

        res.status(200).json({
          ok: true,
          tickets
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
   * Create new tickets with the provided data.
   *
   * @param {Object} req - Express request object containing the ticket data in the request body.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the newly created ticket details or an error message.
   */
  async create(req, res = response) {
    try {      
      const {
        eventId,
        quantity,
        ticketType: {
            price,
            date,
            type
        },
        status,
        expirationDate
    } = req.body;

    const newOrder = new Order({
      eventId,
      quantity,
      ticketType: {
          price,
          date,
          type
      },
      status,
      expirationDate
  });

    const savedNewOrder = await newOrder.save();
      
    res.status(200).json({
      ok: true,        
      savedNewOrder
    });

    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message
      });
    }
  }
    /**
     * Get a ticket by its ID and populate its associated event.
     *
     * @param {Object} req - Express request object containing the ticket ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the ticket details or an error message if not found.
     */
    async get(req, res = response) {
      const { id } = req.params;

      try {
        const ticket = await Order.findById(id).populate('event', {
            eventId: 1,
            eventType: 1, 
            ticketPurchaseDeadline: 1, 
            hasLimitedPlaces: 1, 
            title: 1,
            address: 1,
            date: 1
        });

        if (!ticket) {
          return res.status(404).json({ 
            ok: false, 
            error: `Order with id ${id} not found.` 
          });
        }
        
        const { purchaser, ... params} = ticket.toObject();
        params.ticketNumber = ticketNumber(params.ticketNumber);

        res.status(200).json({
          ok: true,
          ticket: params
        });

      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
     * Update a ticket's information by its ID.
     *
     * @param {Object} req - Express request object containing the ticket ID in the request body and updated data in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the updated ticket details or an error message if not found.
     */
    async update(req, res = response) {
      const { id } = req.body;
      const {
        event,
        purchaser: {
          purchaserFirstName,
          purchaserLastName,
          purchaserDni,
          purchaserEmail,
          purchaserId
        },
        attendee: {
          attendeeFirstName,
          attendeeLastName,
          attendeeDni
        },
        validated,
        purchaseDate,
        validationDate,
        ticketNumber
      } = req.body;
      
      
      try {
        const ticket = await Order.findByIdAndUpdate(id, {
          event,
          purchaser: {
            purchaserFirstName,
            purchaserLastName,
            purchaserDni,
            purchaserEmail,
            purchaserId
          },
          attendee: {
            attendeeFirstName,
            attendeeLastName,
            attendeeDni
          },
          validated,
          purchaseDate,
          validationDate,
          ticketNumber
        }, 
        { 
          new: true 
        });

        res.status(200).json({
          ok: true,
          ticket
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

    /**
     * Delete a ticket by its ID.
     *
     * @param {Object} req - Express request object containing the ticket ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure of the delete operation.
     */
    async delete(req, res = response) {
      const { id } = req.params;

      try {
        await Order.findByIdAndRemove(id, { new: true });

        res.status(200).json({
          ok: true
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

    /**
     * Validate a ticket by its ID.
     *
     * @param {Object} req - Express request object containing the ticket ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure of the delete operation.
     */
    async validate(req, res = response){
      try {
        const { id } = req.params;
        const ticket = await Order.findById(id);

        if (!ticket) {
          return res.status(404).json({ 
            ok: false, 
            error: `Order with id ${id} not found.` 
          });
        }

        if (ticket.validated) {
          return res.status(404).json({ 
            ok: false, 
            error: `Order with id ${id} is already validated.` 
          });
        }
        
        ticket.validated = true;
        ticket.validationDate = new Date();
        await ticket.save();
        
        const { purchaser, ... params} = ticket.toObject();

        res.status(200).json({
          ok: true,
          ticket: params
        });

      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
}

export {
  OrderController
};