const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['video', 'chat', 'in-person'],
    default: 'video',
  },
  symptoms: {
    type: String,
    required: [true, 'Symptoms are required'],
  },
  consultationNotes: {
    type: String,
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending',
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentIntentId: String,
  cancellationReason: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: String,
}, {
  timestamps: true,
});

// Index for faster queries
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
