const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { sendAppointmentConfirmation } = require('../utils/emailService');

// @desc    Book appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, appointmentDate, timeSlot, symptoms, type } = req.body;

  // Check if doctor exists
  const doctor = await Doctor.findById(doctorId).populate('userId');

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  if (!doctor.isApproved) {
    res.status(400);
    throw new Error('Doctor is not approved yet');
  }

  // Check if slot is available
  const existingAppointment = await Appointment.findOne({
    doctorId,
    appointmentDate: new Date(appointmentDate),
    'timeSlot.startTime': timeSlot.startTime,
    status: { $in: ['pending', 'confirmed'] },
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error('This time slot is already booked');
  }

  // Create appointment
  const appointment = await Appointment.create({
    patientId: req.user.id,
    doctorId,
    appointmentDate: new Date(appointmentDate),
    timeSlot,
    symptoms,
    type: type || 'video',
    amount: doctor.consultationFee,
    status: 'pending',
  });

  // Populate patient and doctor details
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('patientId', 'firstName lastName email phone')
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'firstName lastName email' }
    });

  // Send confirmation email
  try {
    const patient = await User.findById(req.user.id);
    await sendAppointmentConfirmation(patient.email, {
      doctorName: `${doctor.userId.firstName} ${doctor.userId.lastName}`,
      date: new Date(appointmentDate).toLocaleDateString(),
      time: `${timeSlot.startTime} - ${timeSlot.endTime}`,
      type,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: populatedAppointment,
  });
});

// @desc    Get patient appointments
// @route   GET /api/appointments/patient/:id
// @access  Private
exports.getPatientAppointments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check authorization
  if (req.user.id !== id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view these appointments');
  }

  const appointments = await Appointment.find({ patientId: id })
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'firstName lastName email profilePicture' }
    })
    .populate('prescriptionId')
    .sort({ appointmentDate: -1 });

  res.json({
    success: true,
    data: appointments,
  });
});

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor/:id
// @access  Private (Doctor/Admin)
exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doctor = await Doctor.findById(id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check authorization
  if (doctor.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view these appointments');
  }

  const appointments = await Appointment.find({ doctorId: id })
    .populate('patientId', 'firstName lastName email phone profilePicture')
    .populate('prescriptionId')
    .sort({ appointmentDate: -1 });

  res.json({
    success: true,
    data: appointments,
  });
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const { status, consultationNotes, cancellationReason } = req.body;

  // Authorization check
  const doctor = await Doctor.findById(appointment.doctorId);
  const isDoctor = doctor && doctor.userId.toString() === req.user.id;
  const isPatient = appointment.patientId.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isDoctor && !isPatient && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this appointment');
  }

  // Update status
  if (status) {
    appointment.status = status;
  }

  if (consultationNotes && isDoctor) {
    appointment.consultationNotes = consultationNotes;
  }

  if (cancellationReason && status === 'cancelled') {
    appointment.cancellationReason = cancellationReason;
  }

  const updatedAppointment = await appointment.save();

  res.json({
    success: true,
    data: updatedAppointment,
  });
});

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check authorization
  const doctor = await Doctor.findById(appointment.doctorId);
  const isDoctor = doctor && doctor.userId.toString() === req.user.id;
  const isPatient = appointment.patientId.toString() === req.user.id;

  if (!isDoctor && !isPatient && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this appointment');
  }

  appointment.status = 'cancelled';
  appointment.cancellationReason = req.body.reason || 'Cancelled by user';
  await appointment.save();

  res.json({
    success: true,
    message: 'Appointment cancelled successfully',
  });
});

// @desc    Get appointment details
// @route   GET /api/appointments/:id/details
// @access  Private
exports.getAppointmentDetails = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patientId', 'firstName lastName email phone profilePicture')
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'firstName lastName email' }
    })
    .populate('prescriptionId');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check authorization
  const doctor = await Doctor.findById(appointment.doctorId);
  const isDoctor = doctor && doctor.userId.toString() === req.user.id;
  const isPatient = appointment.patientId._id.toString() === req.user.id;

  if (!isDoctor && !isPatient && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this appointment');
  }

  res.json({
    success: true,
    data: appointment,
  });
});

// @desc    Add rating and review
// @route   PUT /api/appointments/:id/review
// @access  Private (Patient)
exports.addReview = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if patient owns this appointment
  if (appointment.patientId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to review this appointment');
  }

  // Check if appointment is completed
  if (appointment.status !== 'completed') {
    res.status(400);
    throw new Error('Can only review completed appointments');
  }

  const { rating, review } = req.body;

  appointment.rating = rating;
  appointment.review = review;
  await appointment.save();

  // Update doctor rating
  const doctor = await Doctor.findById(appointment.doctorId);
  const totalRating = doctor.rating * doctor.totalRatings + rating;
  doctor.totalRatings += 1;
  doctor.rating = totalRating / doctor.totalRatings;
  await doctor.save();

  res.json({
    success: true,
    message: 'Review added successfully',
    data: appointment,
  });
});
