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
  dni: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  purchasedTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;