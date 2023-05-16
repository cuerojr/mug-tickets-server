const { response } = require('express');
const Event = require('../models/eventModel');

class EventController {    
    constructor(){}

    async getAll(req, res = response) {
      try {
        const events = await Event.find({});

        res.json({
          ok: true,
          events
        });
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async create(req, res = response) {
      try {
        const {
          eventType,
          availableTickets,
          ticketPurchaseDeadline,
          showInfo: { 
            title, 
            address, 
            date 
          },
        } = req.body;

        const newEvent = new Event({
          eventType,
          availableTickets,
          ticketPurchaseDeadline,
          showInfo: { 
            title, 
            address, 
            date
          },
        });

        await newEvent.save();

        res.json({
          ok: true,
          newEvent
        });
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async get(req, res = response) {
      const { id } = req.params;

      try {
        const event = await Event.findById(id);
        
        res.json({
          ok: true,
          event
        });
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async update(req, res = response) {
      const { id } = req.params;
      const { name, description } = req.body;

      try {
        const event = await Event.findByIdAndUpdate(id, { name, description }, { new: true });

        res.json({
          ok: true,
          event
        });        
      } catch (err) {
        console.error(err.message);
      }
    }

    async delete(req, res = response) {
      const { id } = req.params;

      try {
        await Event.findByIdAndRemove(id, { new: true });

        res.json({
          ok: true
        });
      } catch (err) {
        console.error(err.message);
      }
    }
}

module.exports = EventController;