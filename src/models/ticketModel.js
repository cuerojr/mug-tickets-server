const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  purchaser: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dni: {
      type: String,
      required: true
    }
  },
  attendee: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dni: {
      type: String,
      required: true
    }
  },
  validated: {
    type: Boolean,
    default: false
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  validationDate: {
    type: Date,
    default: null
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;