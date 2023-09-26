import mongoose from 'mongoose';

/**
 * Mongoose schema for the 'Order' collection.
 */
const orderSchema = new mongoose.Schema({  
    eventId: {
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        min: 1,
        default: 1
    },
    ticketType: {
        price:{
            type: Number,
            min: 0,
            default: 0
        },
        date: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        default: 'Pending'
    },
    expirationDate: {
        type: Date,
        required: false,
    }
});

const Order = mongoose.model('Order', orderSchema);
export {
  Order 
};