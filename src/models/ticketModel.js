const mongoose = require('mongoose');
const Counter = require('./counterModel');

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
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
  },
  ticketNumber: {
    type: Number,
    unique: false,
    default: 0
  },
  ticketUniqueNumber: {
    type: Number,
    unique: false,
    default: 0,
    required: false
  }
});

/*ticketSchema.pre('save', async function (next) {
  const doc = this;  
  if (!doc.ticketNumber) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'ticketNumber' },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      ).exec();
      doc.ticketNumber = counter.sequence_value;
    } catch (error) {
      console.error('Error while generating ticket number:', error);
      throw error;
    }
  }
  next();
});*/


ticketSchema.method('toJSON', function() {
  const { __v, _id, ... object } = this.toObject();
  object.ticketId = _id;
  return object;
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;