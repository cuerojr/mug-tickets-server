const { response } = require('express');
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const Event = require('../models/eventModel');

class TicketController {    
    constructor(){}

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
  
    async create(req, res = response) {      
      try {
        console.log(req.body)
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

        if(purchaseEvent?.hasLimitedPlaces && purchaseEvent?.ticketsAvailableOnline <= purchaseEvent.purchasedTicketsList.length) {
          return res.status(404).json({
            ok: false,
            message: 'Sold out!'
          });          
        }

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
          ticketUniqueNumber: purchaseEvent.ticketsPurchased + 1
        });
        console.log(newTicket)
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
     * Gets a ticket by ID and populates its event field
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @returns {object} - Returns a JSON object with `ok` and `ticket` fields if successful, otherwise returns an error message
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

    async delete(req, res = response) {
      const { id } = req.params;

      try {
        await Ticket.findByIdAndRemove(id, { new: true });

        res.status(200).json({
          ok: true
        });
      } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
      }
    }
}

module.exports = {
  TicketController
};