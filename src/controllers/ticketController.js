const { response } = require('express');
const Ticket = require('../models/ticketModel');

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
      try {
        const {
          event,
          purchaser: { 
            purchaserFirstName, 
            purchaserLastName, 
            purchaserDni 
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

        const newTicket = new Ticket({
          event,
          purchaser: { 
            purchaserFirstName, 
            purchaserLastName, 
            purchaserDni 
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

        await newTicket.save();

        res.json(newTicket);
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async get(req, res = response) {
      try {
        const { id } = req.body;
        const ticket = await Ticket.findById(id);
        res.json(ticket);
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async update(req, res = response) {
      try {
        const { id } = req.params;
        const { name, description } = req.body;
        const ticket = await Ticket.findByIdAndUpdate(id, { name, description }, { new: true });
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