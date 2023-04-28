const { response } = require('express');
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

class TicketController {
    
    constructor(){}

    async getAll(req, res = response) {
      try {
        const tickets = await Ticket.find({});
        res.json({
          ok: true,
          tickets
        });
      } catch (err) {
        console.error(err.message);
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
        console.log(user)
//return
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

        res.json(savedNewTicket);

      } catch (err) {
        console.error(err.message);
      }
    }
  
    async get(req, res = response) {
      const { id } = req.body;

      try {
        const ticket = await Ticket.findById(id);
        res.json(ticket);
      } catch (err) {
        console.error(err.message);
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

        res.json(ticket);
      } catch (err) {
        console.error(err.message);
      }
    }

    async update(req, res = response) {
      try {
        /*const { id } = req.params;
        const { name, description } = req.body;
        const resource = await Resource.findByIdAndUpdate(id, { name, description }, { new: true });
        res.json(resource);*/
      } catch (err) {
        console.error(err.message);
      }
    }

    async delete(req, res = response) {
      try {
        /*const { id } = req.params;
        const { name, description } = req.body;
        const resource = await Resource.findByIdAndUpdate(id, { name, description }, { new: true });
        res.json(resource);*/
      } catch (err) {
        console.error(err.message);
      }
    }
}

module.exports = TicketController;