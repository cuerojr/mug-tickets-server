import { response } from 'express';
import { Event } from '../models/eventModel.js';
import { Order } from '../models/orderModel.js';
import { TicketType } from '../models/ticketTypeModel.js';
import { Admin } from '../models/adminModel.js';
import { ticketNumbers, flattenArray } from '../helpers/dataFormatter.js';

/**
 * Controller class for handling event-related operations.
 */
class EventController {    
    constructor(){}

    /**
     * Get all events from the database.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of events or an error message.
     */
    async getAll(req, res = response) {
      try {
        /*const events = await Event.find({
          date: {
              $gt: new Date()
          }
        }).sort({ date: 1 }).populate('purchasedTicketsList');*/
        const events = await Event.find({}).populate('ticketsTypeList');
        
        res.status(200).json({
          ok: true,
          events
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

    /**
     * Filter events based on the provided query parameters.
     *
     * @param {Object} req - Express request object containing query parameters by id.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of filtered events or an error message.
     */
    async filter(req, res = response) {
      try {
        if (!req.query) {
          return res.status(404).json({
            ok: false,
            error: 'No events matched your search'
          });
        }

        const event$ = await Event.findOne(req.query)
          .populate('purchasedTicketsList', {
              purchaser: 1,
              ticketNumber: 1,
              validated: 1,
              validationDate: 1,
              ticketType: 1,
              qrCode: 1
          })
          .populate('ticketsTypeList', { 
            ticketsPurchased: 1, 
            ticketsAvailableOnline: 1,
            type: 1,
            isAbono: 1
          });
        
        if (!event$) {
            return res.status(404).json({
              ok: false,
              error: 'No events matched your search'
            });
        }

        const orders = await Order.find({ "status": "aproved" });
        const { title, ticketsTypeList, purchasedTicketsList } = event$;

        const event = {
          title,
          ticketsTypeList,
          tickets: purchasedTicketsList.map((item) => {        
            const { purchaser, ticketNumber, validated, validationDate, _id, ticketType } = item;
            const { purchaserFirstName, purchaserLastName, purchaserEmail, purchaserDni } = purchaser;

            const order$ = orders.filter(order => order.purchaser.purchaserEmail === purchaserEmail);
            // const isAbono$ = ticketsTypeList.filter(data => data._id.toString() === order$.at(-1).ticketType._id.toString())

            console.log('ticketType', order$[0].ticketType)
            
            
            return {
              name: `${ purchaserFirstName } ${ purchaserLastName }`,
              email: `${ purchaserEmail }`,
              dni: `${ purchaserDni }`,
              ticketNumber: ticketNumbers(ticketNumber),
              validated,
              validationDate,
              _id,
              ticketType: ticketType ?? order$[0].ticketType,
              orderTicketType: order$[0].ticketType,
              // isAbono: isAbono$[0]?.isAbono ?? null
            }
          })          
        }
        
        res.status(200).json({
          ok: true,
          event
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
     * Create a new event with the provided data.
     *
     * @param {Object} req - Express request object containing the event data in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the newly created event details or an error message.
     */
    async create(req, res = response) {
      try {
        const {
          creatorId,
          eventType,
          ticketsAvailableOnline,
          ticketPurchaseDeadline,
          hasLimitedPlaces,
          title, 
          description,
          address, 
          dates,
          image,
          price
        } = req.body;

        const newEvent = new Event({
          eventType,
          ticketsAvailableOnline,
          ticketPurchaseDeadline,
          hasLimitedPlaces,          
          title, 
          description,
          address, 
          dates,
          image,
          price      
        });

        if (!creatorId) {
          return res.status(404).json({ 
            ok: false, 
            error: `Missing creator Id ${creatorId}.` 
          });
        }

        const admin = await Admin.findById(creatorId);
        const savedNewEvent = await newEvent.save();
        admin.eventsCreatedList = admin.eventsCreatedList.concat(savedNewEvent._id);

        await admin.save();
        
        res.status(200).json({
          ok: true,
          newEvent
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
     * Get an event by its ID.
     *
     * @param {Object} req - Express request object containing the event ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the event details or an error message if not found.
     */
    async get(req, res = response) {      
      try {
        const { id } = req.params;
        const event = await Event.findById(id).populate('ticketsTypeList');
        if (!event) {
          return res.status(404).json({ 
            ok: false, 
            error: `Event with id ${id} not found.` 
          });
        }

        res.status(200).json({
          ok: true,
          event
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
     * Update an event's information by its ID.
     *
     * @param {Object} req - Express request object containing the event ID in the request parameters and updated data in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the updated event details or an error message if not found.
     */
    async update(req, res = response) {
      const { id } = req.params;
      const {
        eventType,
        hasLimitedPlaces,
        ticketsAvailableOnline,
        title, 
        description,
        address
      } = req.body;

      try {
        const updatedEvent = await Event.findByIdAndUpdate(id, {
          eventType,
          hasLimitedPlaces,
          title, 
          description,
          address,
          ticketsAvailableOnline,
        }, { new: true });
        
        if (!updatedEvent) {
          return res.status(404).json({ 
              ok: false, 
              error: `Event with id ${id} not found.` 
            });
        }

        res.status(200).json({
          ok: true,
          updatedEvent
        });        
      } catch (err) {
        res.status(500).json({ 
          ok: false, error: 
          err.message 
        });
      }
    }

    /**
     * Delete an event by its ID.
     *
     * @param {Object} req - Express request object containing the event ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure of the delete operation.
     */
    async delete(req, res = response) {
      const { id } = req.params;

      try {
        const deletedEvent = await Event.findByIdAndRemove(id, { new: true });
        if (!deletedEvent) {
          return res.status(404).json({ 
            ok: false, 
            error: `Event with id ${id} not found.` 
          });
        }

        res.status(200).json({
          ok: true,
          message: `Event with id ${ id } was deleted.`
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
  EventController 
};