const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  purchaser: {
    purchaserFirstName: {
      type: String,
      required: true
    },
    purchaserLastName: {
      type: String,
      required: true
    },
    purchaserId: {
      type: String,
      required: true
    }
  },
  attendee: {
    attendeeFirstName: {
      type: String,
      required: true
    },
    attendeeLastName: {
      type: String,
      required: true
    },
    attendeeDni: {
      type: Number,
      required: true
    }
  },
  validated: {
    type: Boolean,
    default: false
  },
  purchased: {
    type: Boolean,
    default: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },  
  validationDate: {
    type: Date,
    default: null
  },
  qrCode: {
    type: String,
    //required: true
  }

});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;