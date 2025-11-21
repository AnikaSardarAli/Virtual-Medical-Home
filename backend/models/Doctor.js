const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
  },
  qualifications: [{
    type: String,
    required: true,
  }],
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: 0,
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    slots: [{
      startTime: String,
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false,
      },
    }],
  }],
  biography: {
    type: String,
    maxlength: 1000,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  documents: [{
    type: String,
  }],
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Doctor', doctorSchema);
