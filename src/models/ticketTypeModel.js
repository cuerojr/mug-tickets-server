import mongoose from 'mongoose';

/**
 * Mongoose schema for the 'ticketType' collection.
 */
const ticketTypeSchema = new mongoose.Schema({  
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    price:{
        type: Number,
        min: 0,
        default: 0
    },
    quantity:{
        type: Number,
        min: 1,
        default: 1
    },
    date: { //make a list for abono's dates
        type: Date,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: false,
        default: Date.now
    },
    ticketsAvailableOnline: {
        type: Number,
        required: true,
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
        required: true
    },
    isActive: {
        type: Boolean,
        default: false,
        required: false
    },
    isAbono: {
        type: Boolean,
        default: false,
        required: false
    },
    deleted: {
      type: Boolean,
      required: false
    }
});

/*eventSchema.pre('save', async function(next) {
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
});*/

/**
 * Mongoose pre-save hook for the 'ticketType' schema.
 */
/*ticketTypeSchema.method('toJSON', function() {
  const { __v, _id, ... object } = this.toObject();
  object.ticketId = _id;
  return object;
});*/

const TicketType = mongoose.model('TicketType', ticketTypeSchema);
export {
  TicketType 
};