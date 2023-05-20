const { response } = require('express');
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

class TicketController {    
    constructor(){}

    async getAll(req, res = response) {
      try {
        const tickets = await Ticket.find({}).populate('event');

        res.status(200).json({
          ok: true,
          tickets
        });
      } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
      }
    }
  
    async create(req, res = response) {
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

      try {
        const user = await User.findById(purchaserId);

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
          validationDate
        });

        const savedNewTicket = await newTicket.save();
        
        user.purchasedTickets = user.purchasedTickets.concat(savedNewTicket._id);
        await user.save();

        res.status(200).json({
          ok: true,
          savedNewTicket
        });
      } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
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
        const ticket = await Ticket.findById(id).populate('event');
        if (!ticket) {
          return res
          .status(404)
          .json({ ok: false, error: `Ticket with id ${id} not found.` });
        }

        res.status(200).json({
          ok: true,
          ticket
        });
      } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
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
        res.status(500).json({ ok: false, error: err.message });
      }
    }

    async update(req, res = response) {
      try {
        /*const { id } = req.params;
        const { name, description } = req.body;
        const updatedUser = await Ticket.findByIdAndUpdate(id, { name, description }, { new: true });
        res.json(updatedUser);*/
      } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
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

module.exports = TicketController;