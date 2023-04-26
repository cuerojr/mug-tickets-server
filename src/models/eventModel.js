const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  },
  availableTickets: {
    type: Number,
    required: true,
    min: 0,
  },
  ticketPurchaseDeadline: {
    type: Date,
    required: true,
  },
  showInfo: {
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    }
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;