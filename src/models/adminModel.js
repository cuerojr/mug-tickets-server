const mongoose = require('mongoose');

/**
 * Mongoose schema for the 'admin' collection.
 */
const adminSchema = new mongoose.Schema({
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
  image: {
    type: String,
    required: false
  },
  eventsCreatedList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
});

/**
 * Method to convert the Mongoose document to a JSON object.
 * Removes '__v' and 'password' fields from the returned JSON object.
 * Adds 'uid' field using the '_id' field for the returned JSON object.
 */
adminSchema.method('toJSON', function() {
  const { __v, _id, password, ... object } = this.toObject();
  object.uid = _id;
  return object;
});

/**
 * Mongoose model for the 'Admin' collection based on the 'adminSchema'.
 */
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;