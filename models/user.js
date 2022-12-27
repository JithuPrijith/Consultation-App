const mongoose = require('mongoose');
const TimeSlotBooking = require('../models/booking')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'  //role is assigned for user as doctor/normal user
  },
  bookingDetails :{ 
    type:Array,
    ref:TimeSlotBooking
  },
  pinned:{
    type:Boolean,
    default:false
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
