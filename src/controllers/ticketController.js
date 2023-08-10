const { response } = require('express');
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const Event = require('../models/eventModel');

/**
 * Controller class for handling ticket-related operations.
 */
class TicketController {    
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
        const tickets = await Ticket.find({}).populate('event', {
            eventId: 1,
            eventType: 1, 
            ticketPurchaseDeadline: 1, 
            hasLimitedPlaces: 1, 
            title: 1,
            address: 1,
            date: 1
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
     * Filter tickets based on the provided query parameters.
     *
     * @param {Object} req - Express request object containing query parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of filtered tickets or an error message.
     */
    async filter(req, res = response) {
      try {
        const tickets = await Ticket.find(req.query);
        if (tickets.length < 1) {
            return res.status(404).json({
              ok: false,
              error: 'No events matched your search'
            });
        } 
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
     * Create a new ticket with the provided data.
     *
     * @param {Object} req - Express request object containing the ticket data in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the newly created ticket details or an error message.
     */
    async create(req, res = response) { 
      try {
        const {
          event,
          purchaser: { 
            purchaserFirstName, 
            purchaserLastName, 
            purchaserDni,
            purchaserId
          },
          attendee: { 
            attendeeFirstName, 
            attendeeLastName, 
            attendeeDni 
          },
          validated,
          purchaseDate,
          validationDate
        } = req.body;

        const [ purchaseEvent, user ] = await Promise.all([
          Event.findById(event), 
          User.findById(purchaserId)
        ]);

        if(purchaseEvent?.hasLimitedPlaces && purchaseEvent?.ticketsAvailableOnline <= purchaseEvent?.purchasedTicketsList?.length) {
          return res.status(404).json({
            ok: false,
            message: 'Sold out!'
          });          
        }
        const ticketNumber = +purchaseEvent?.purchasedTicketsList?.length + 1;
        const newTicket = new Ticket({
          event,
          purchaser: { 
            purchaserFirstName, 
            purchaserLastName, 
            purchaserDni,
            purchaserId: user._id
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
        });
        
        const savedNewTicket = await newTicket.save();
        user.purchasedTickets = user.purchasedTickets.concat(savedNewTicket._id);
        
        purchaseEvent.ticketsPurchased = purchaseEvent.ticketsPurchased + 1;
        purchaseEvent.purchasedTicketsList = purchaseEvent.purchasedTicketsList.concat(savedNewTicket._id);

        await purchaseEvent.save();
        await user.save();

        res.status(200).json({
          ok: true,
          savedNewTicket
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
      const ticketsData = req.body.tickets;

      const eventsIds = ticketsData.map(ticket => ticket.event);
      const purchasersIds = ticketsData.map(ticket => ticket.purchaser.purchaserId);

      const [purchaseEvents, users] = await Promise.all([
        Event.find({ _id: { $in: eventsIds } }),
        User.find({ _id: { $in: purchasersIds } })
      ]);

      const insertData = ticketsData.map((ticket, index) => {
        const purchaseEvent = purchaseEvents.find(event => event._id.toString() === ticket.event);
        const user = users.find(user => user._id.toString() === ticket.purchaser.purchaserId);

        if (purchaseEvent?.hasLimitedPlaces && purchaseEvent?.ticketsAvailableOnline <= purchaseEvent?.purchasedTicketsList?.length) {
          return {
            error: {
              message: 'Sold out!',
              ticketIndex: index
            }
          };
        }

        const ticketNumber = purchaseEvent?.purchasedTicketsList?.length + (index + 1);
        const newTicket = new Ticket({
          event: ticket.event,
          purchaser: {
            purchaserFirstName: ticket.purchaser.purchaserFirstName,
            purchaserLastName: ticket.purchaser.purchaserLastName,
            purchaserDni: ticket.purchaser.purchaserDni,
            purchaserId: user._id
          },
          attendee: {
            attendeeFirstName: ticket.attendee.attendeeFirstName,
            attendeeLastName: ticket.attendee.attendeeLastName,
            attendeeDni: ticket.attendee.attendeeDni
          },
          validated: ticket.validated,
          purchaseDate: ticket.purchaseDate,
          validationDate: ticket.validationDate,
          ticketNumber
        });

        return newTicket;
      });

      const savedTickets = await Ticket.insertMany(insertData.filter(ticket => !ticket.error));

      savedTickets.forEach((savedTicket, index) => {
        const ticket = ticketsData[index];
        const user = users.find(user => user._id.toString() === ticket.purchaser.purchaserId);
        const purchaseEvent = purchaseEvents.find(event => event._id.toString() === ticket.event);

        user.purchasedTickets.push(savedTicket._id);
        purchaseEvent.ticketsPurchased += 1;
        purchaseEvent.purchasedTicketsList.push(savedTicket._id);
      });

      await Promise.all([
        ...users.map(user => user.save()),
        ...purchaseEvents.map(event => event.save())
      ]);

      res.status(200).json({
        ok: true,
        savedTickets
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
        const ticket = await Ticket.findById(id).populate('event', {
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
            error: `Ticket with id ${id} not found.` 
          });
        }
        
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
  
    /**
     * Update a ticket's information by its ID.
     *
     * @param {Object} req - Express request object containing the ticket ID in the request body and updated data in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the updated ticket details or an error message if not found.
     */
    async update(req, res = response) {
      const { id } = req.body;
      const { name, description } = req.body;

      try {
        const ticket = await Ticket.findByIdAndUpdate(id, { 
          name, 
          description 
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
        await Ticket.findByIdAndRemove(id, { new: true });

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

    async validate(req, res = response){
      try {
        const { id } = req.params;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
          return res.status(404).json({ 
            ok: false, 
            error: `Ticket with id ${id} not found.` 
          });
        }

        if (ticket.validated) {
          return res.status(404).json({ 
            ok: false, 
            error: `Ticket with id ${id} is already validated.` 
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

module.exports = {
  TicketController
};