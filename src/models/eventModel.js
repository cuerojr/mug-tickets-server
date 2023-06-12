const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  },
  ticketsAvailableOnline: {
    type: Number,
    default: 0,
    min: 0,
  },
  ticketsPurchased: {
    type: Number,
    default: 0,
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
    description: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: false
    },
    ticketsAvailableOffline: {
      type: Number,
      min: 0,
    },
  },
});

eventSchema.method('toJSON', function() {
  const { __v, _id, ... object } = this.toObject();
  object.eventId = _id;
  return object;
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;