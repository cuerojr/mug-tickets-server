const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dni: {
    type: Number,
    required: true,
    unique: true,
    trim: true
  },
  purchasedTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }]
});

userSchema.method('toJSON', function() {
  const { __v, _id, password, ... object } = this.toObject();
  object.uid = _id;
  return object;
});

const User = mongoose.model('User', userSchema);
module.exports = User;