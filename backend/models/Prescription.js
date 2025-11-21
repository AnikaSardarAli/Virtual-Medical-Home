const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  medicines: [{
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    instructions: String,
  }],
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
  },
  additionalNotes: {
    type: String,
  },
  tests: [{
    testName: String,
    instructions: String,
  }],
  followUpDate: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
