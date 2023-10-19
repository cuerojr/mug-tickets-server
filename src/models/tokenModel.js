import mongoose from 'mongoose';
/**
 * Mongoose schema for the 'token' collection.
 */
const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
});

/**
 * Mongoose model for the 'Token' collection based on the 'tokenSchema'.
 */
const Token = mongoose.model('Token', tokenSchema);
export {
  Token
};