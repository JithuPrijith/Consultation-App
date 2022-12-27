const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  doctorId:{
    type: String,
    required: true  
  },
  userId:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
