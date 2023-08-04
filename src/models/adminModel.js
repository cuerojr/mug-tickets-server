const mongoose = require('mongoose');

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
  }
});

adminSchema.method('toJSON', function() {
  const { __v, _id, password, ... object } = this.toObject();
  object.uid = _id;
  return object;
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;