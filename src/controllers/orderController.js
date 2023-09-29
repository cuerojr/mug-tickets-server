import { response } from "express";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import { Event } from "../models/eventModel.js";
import { TicketController } from "./ticketController.js";
const ticketController = new TicketController();
/**
 * Controller class for handling ticket-related operations.
 */
class OrderController {
  constructor() {  }

  /**
   * Get all order from the database and populate their associated events.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing an array of order or an error message.
   */
  async getAll(req, res = response) {
    try {
      const orders = await Order.find({}).populate("event", {
        eventId: 1,
        eventType: 1,
        ticketPurchaseDeadline: 1,
        hasLimitedPlaces: 1,
        description: 1,
        title: 1,
        address: 1,
        date: 1,
      });

      res.status(200).json({
        ok: true,
        orders,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }

  /**
   * Filter order based on the provided query parameters.
   *
   * @param {Object} req - Express request object containing query parameters.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing an array of filtered order or an error message.
   */
  async filter(req, res = response) {
    try {
      const orders = await Order.find(req.query);

      if (orders.length < 1) {
        return res.status(404).json({
          ok: false,
          error: "No orders matched your search",
        });
      }

      res.status(200).json({
        ok: true,
        orders,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }

  /**
   * Create new order with the provided data.
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
        ticketType: { price, date, type },
        status,
        expirationDate,
      } = req.body;

      if(!eventId) {
        return res.status(404).json({
          ok: false,
          message: 'Event id is required',
        });
      }

      const newOrder = new Order({
        event: eventId,
        quantity,
        ticketType: {
          price,
          date,
          type,
        },
        status,
        expirationDate,
      });

      const savedNewOrder = await newOrder.save();
      await newOrder.populate("event", {
        eventId: 1,
        eventType: 1,
        ticketPurchaseDeadline: 1,
        hasLimitedPlaces: 1,
        title: 1,
        address: 1,
        date: 1,
        description: 1,
        image: 1,
        ticketsAvailableOnline: 1,
      });

      res.status(200).json({
        ok: true,
        savedNewOrder,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
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
    try {
      const { id } = req.params;
      const order = await Order.findById(id).populate('event', {
        eventId: 1,
        eventType: 1,
        ticketPurchaseDeadline: 1,
        hasLimitedPlaces: 1,
        description: 1,
        title: 1,
        image: 1,
        address: 1,
        date: 1,
      });

      if (!order) {
        return res.status(404).json({
          ok: false,
          error: `Order with id ${id} not found.`,
        });
      }

      res.status(200).json({
        ok: true,
        order,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }

  /**
   * Update a order's information by its ID.
   *
   * @param {Object} req - Express request object containing the order ID in the request body and updated data in the request body.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the updated order details or an error message if not found.
   */
  async update(req, res = response) {  
    try {   
      const STATUS = {
        "aproved": 1,
        "pending": 2,
        "cancelled": 3,
      };
      
      const { id } = req.params;
      const {
        eventId,
        quantity,
        ticketType: { 
          price, 
          date, 
          type 
        },
        status,
        expirationDate,
        purchaser: { 
          purchaserFirstName, 
          purchaserLastName, 
          purchaserDni,
          purchaserEmail
        }
      } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          eventId,
          quantity,
          ticketType: {
            price,
            date,
            type,
          },
          status,
          expirationDate,
          purchaser: { 
            purchaserFirstName, 
            purchaserLastName, 
            purchaserDni,
            purchaserEmail
          }
        },
        {
          new: true,
        }
      );
      console.log(updatedOrder)
      const action = {
        ['aproved']: async () => {
          
          const tickets = [];
          for (let i = 0; i < quantity; i++) {          
            tickets.push({
              "event": "64fb1f43d2f80bc5d132a8b6",
              "purchaser": { 
                  "purchaserFirstName": "Renzi", 
                  "purchaserLastName": "Lenny", 
                  "purchaserDni": 27235222,
                  "purchaserEmail": "tito22332s@gasfo.com"
                  },
              "attendee": { 
                  "attendeeFirstName": "Galita", 
                  "attendeeLastName": "Moldasqui", 
                  "attendeeDni": 32405970
              }
          });
          }
          /**
           * {
        "event": "64fb1f43d2f80bc5d132a8b6",
        "purchaser": { 
            "purchaserFirstName": "Renzi", 
            "purchaserLastName": "Lenny", 
            "purchaserDni": 27235222,
            "purchaserEmail": "tito22332s@gasfo.com"
            },
        "attendee": { 
            "attendeeFirstName": "Galita", 
            "attendeeLastName": "Moldasqui", 
            "attendeeDni": 32405970
        }
    },{
        "event": "64fb1f43d2f80bc5d132a8b6",
        "purchaser": { 
            "purchaserFirstName": "Renzi", 
            "purchaserLastName": "Lenny", 
            "purchaserDni": 27235222,
            "purchaserEmail": "tito22332s@gasfo.com"
            },
        "attendee": { 
            "attendeeFirstName": "Galita", 
            "attendeeLastName": "Moldasqui", 
            "attendeeDni": 32405970
        }
    }
           */
          await ticketController.createTickets( tickets );
        },
        ['pending']: () => {          
          console.log("🚀 ~ pending:")
        },
        ['cancelled']: () => {          
          console.log("🚀 ~ cancelled:")
        },
      };
      
      action[updatedOrder.status.toLowerCase()]?.();
      
      // editar el status 
      /**
        on success de status
        datos usuario + updatedOrder
        
        crear ticket
        ticketController.create()
        

        mailing

        canceled status
      */

      res.status(200).json({
        ok: true,
        updatedOrder,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
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
        ok: true,
        message: `Order with id ${id} was deleted.`,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
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
  async validate(req, res = response) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          ok: false,
          error: `Order with id ${id} not found.`,
        });
      }

      if (order.validated) {
        return res.status(404).json({
          ok: false,
          error: `Order with id ${id} is already validated.`,
        });
      }

      order.validated = true;
      order.validationDate = new Date();
      await order.save();

      const { purchaser, ...params } = order.toObject();

      res.status(200).json({
        ok: true,
        order: params,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }
}

export { OrderController };
