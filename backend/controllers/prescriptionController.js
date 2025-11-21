const asyncHandler = require('express-async-handler');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { generatePrescriptionPDF } = require('../utils/pdfGenerator');

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
exports.createPrescription = asyncHandler(async (req, res) => {
  const { appointmentId, medicines, diagnosis, additionalNotes, tests, followUpDate } = req.body;

  // Get appointment
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if doctor owns this appointment
  const doctor = await Doctor.findById(appointment.doctorId);
  if (doctor.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to create prescription for this appointment');
  }

  // Check if prescription already exists
  if (appointment.prescriptionId) {
    res.status(400);
    throw new Error('Prescription already exists for this appointment');
  }

  // Create prescription
  const prescription = await Prescription.create({
    appointmentId,
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    medicines,
    diagnosis,
    additionalNotes,
    tests,
    followUpDate,
  });

  // Update appointment
  appointment.prescriptionId = prescription._id;
  await appointment.save();

  res.status(201).json({
    success: true,
    message: 'Prescription created successfully',
    data: prescription,
  });
});

// @desc    Get patient prescriptions
// @route   GET /api/prescriptions/patient/:id
// @access  Private
exports.getPatientPrescriptions = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check authorization
  if (req.user.id !== id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view these prescriptions');
  }

  const prescriptions = await Prescription.find({ patientId: id })
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'firstName lastName specialization' }
    })
    .populate('appointmentId')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: prescriptions,
  });
});

// @desc    Get prescription details
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescriptionDetails = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patientId', 'firstName lastName email phone dateOfBirth gender')
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'firstName lastName' }
    })
    .populate('appointmentId');

  if (!prescription) {
    res.status(404);
    throw new Error('Prescription not found');
  }

  // Check authorization
  const doctor = await Doctor.findById(prescription.doctorId);
  const isDoctor = doctor && doctor.userId.toString() === req.user.id;
  const isPatient = prescription.patientId._id.toString() === req.user.id;

  if (!isDoctor && !isPatient && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this prescription');
  }

  res.json({
    success: true,
    data: prescription,
  });
});

// @desc    Download prescription PDF
// @route   GET /api/prescriptions/:id/download
// @access  Private
exports.downloadPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patientId')
    .populate({
      path: 'doctorId',
      populate: { path: 'userId' }
    });

  if (!prescription) {
    res.status(404);
    throw new Error('Prescription not found');
  }

  // Check authorization
  const doctor = await Doctor.findById(prescription.doctorId);
  const isDoctor = doctor && doctor.userId.toString() === req.user.id;
  const isPatient = prescription.patientId._id.toString() === req.user.id;

  if (!isDoctor && !isPatient && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to download this prescription');
  }

  try {
    // Get doctor details including specialization
    const doctorWithDetails = await Doctor.findById(prescription.doctorId._id).populate('userId');
    const doctorInfo = {
      firstName: doctorWithDetails.userId.firstName,
      lastName: doctorWithDetails.userId.lastName,
      specialization: doctorWithDetails.specialization,
      licenseNumber: doctorWithDetails.licenseNumber,
    };

    // Generate PDF
    const fileName = await generatePrescriptionPDF(
      prescription,
      prescription.patientId,
      doctorInfo
    );

    res.json({
      success: true,
      message: 'Prescription PDF generated',
      data: {
        fileName,
        downloadUrl: `/uploads/${fileName}`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500);
    throw new Error('Failed to generate prescription PDF');
  }
});

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor)
exports.updatePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    res.status(404);
    throw new Error('Prescription not found');
  }

  // Check if doctor owns this prescription
  const doctor = await Doctor.findById(prescription.doctorId);
  if (doctor.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this prescription');
  }

  const { medicines, diagnosis, additionalNotes, tests, followUpDate } = req.body;

  prescription.medicines = medicines || prescription.medicines;
  prescription.diagnosis = diagnosis || prescription.diagnosis;
  prescription.additionalNotes = additionalNotes || prescription.additionalNotes;
  prescription.tests = tests || prescription.tests;
  prescription.followUpDate = followUpDate || prescription.followUpDate;

  const updatedPrescription = await prescription.save();

  res.json({
    success: true,
    message: 'Prescription updated successfully',
    data: updatedPrescription,
  });
});
