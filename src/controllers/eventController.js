const { response } = require('express');
const Event = require('../models/eventModel');

class EventController {    
    constructor(){}

    async getAll(req, res = response) {
      try {
        const events = await Event.find({});

        res.status(200).json({
          ok: true,
          events
        });
      } catch (err) {
        res.status(500).json({ ok: false, error: error.message });
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

        res.status(200).json({
          ok: true,
          newEvent
        });
      } catch (err) {
        res.status(500).json({ ok: false, error: error.message });
      }
    }
  
    async get(req, res = response) {
      const { id } = req.params;

      try {
        const event = await Event.findById(id);
        if (!event) {
          return res
            .status(404)
            .json({ ok: false, error: `Event with id ${id} not found.` });
        }

        res.status(200).json({
          ok: true,
          event
        });
      } catch (err) {
        res.status(500).json({ ok: false, error: error.message });
      }
    }
  
    async update(req, res = response) {
      const { id } = req.params;
      const { name, description } = req.body;

      try {
        const updatedEvent = await Event.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedEvent) {
          return res
            .status(404)
            .json({ ok: false, error: `Event with id ${id} not found.` });
        }

        res.status(200).json({
          ok: true,
          updatedEvent
        });        
      } catch (err) {
        res.status(500).json({ ok: false, error: error.message });
      }
    }

    async delete(req, res = response) {
      const { id } = req.params;

      try {
        const deletedEvent = await Event.findByIdAndRemove(id, { new: true });
        if (!deletedEvent) {
          return res
            .status(404)
            .json({ ok: false, error: `Event with id ${id} not found.` });
        }

        res.status(200).json({
          ok: true
        });
      } catch (err) {
        res.status(500).json({ ok: false, error: error.message });
      }
    }
}

module.exports = EventController;