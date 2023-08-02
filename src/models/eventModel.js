const mongoose = require('mongoose');
const Counter = require('./counterModel');

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  },
  ticketsAvailableOnline: {
    type: String,
    required: true,
    default: 0,
    min: 0,
  },
  ticketsPurchased: {
    type: String,
    default: 0,
    min: 0,
  },
  ticketPurchaseDeadline: {
    type: Date,
    required: true
  },
  hasLimitedPlaces: {
    type: Boolean,
    required: true,
    default: false
  },  
  title: {
    type: String,
    required: true,
  },
  description: {
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
  },
  image: {
    type: String,
    required: false
  },
  ticketsAvailableOffline: {
    type: Number,
    min: 0,
  },
  price:{
    type: Number,
    min: 0,
    default: 0
  },
  purchasedTicketsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }]
});

eventSchema.pre('save', async function(next) {
  const event = this;
  if (!event.isNew) {
    next();
  }
  const count = await Counter.count({});
    if (count === 0) {
      const result = await Counter.create({
        _id: 'entity',
        value: event.ticketsAvailableOnline
      });
      event.ticketsPurchased = result.value;
      next();
    } else {
      const result = Counter.findOneAndUpdate(
        { _id: 'entity' },
        { $inc: { value: 1 } },
        { new: true });
      event.ticketsPurchased = result.value;
      next();
    };
});

eventSchema.method('toJSON', function() {
  const { __v, _id, ... object } = this.toObject();
  object.eventId = _id;
  return object;
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;