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

        res.json(newEvent);
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async get(req, res = response) {
      try {
        const { id } = req.params;
        const event = await Event.findById(id);
        res.json(event);
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async update(req, res = response) {
      try {
        const { id } = req.params;
        const { name, description } = req.body;
        const event = await Event.findByIdAndUpdate(id, { name, description }, { new: true });
        res.json(event);
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

module.exports = EventController;