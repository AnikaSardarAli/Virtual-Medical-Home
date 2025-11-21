const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Register doctor
// @route   POST /api/doctors/register
// @access  Private (Doctor role)
exports.registerDoctor = asyncHandler(async (req, res) => {
  const {
    specialization,
    qualifications,
    experience,
    licenseNumber,
    consultationFee,
    biography,
  } = req.body;

  // Check if doctor profile already exists
  const existingDoctor = await Doctor.findOne({ userId: req.user.id });

  if (existingDoctor) {
    res.status(400);
    throw new Error('Doctor profile already exists');
  }

  // Create doctor profile
  const doctor = await Doctor.create({
    userId: req.user.id,
    specialization,
    qualifications,
    experience,
    licenseNumber,
    consultationFee,
    biography,
    documents: req.files ? req.files.map(file => file.path) : [],
  });

  res.status(201).json({
    success: true,
    message: 'Doctor profile created successfully. Waiting for admin approval.',
    data: doctor,
  });
});

// @desc    Get all approved doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = asyncHandler(async (req, res) => {
  const { specialization, search, page = 1, limit = 10 } = req.query;

  let query = { isApproved: true };

  // Filter by specialization
  if (specialization) {
    query.specialization = { $regex: specialization, $options: 'i' };
  }

  const doctors = await Doctor.find(query)
    .populate('userId', 'firstName lastName email phone profilePicture isActive')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ rating: -1 });

  // Filter by search term (name)
  let filteredDoctors = doctors;
  if (search) {
    filteredDoctors = doctors.filter(doctor => {
      const fullName = `${doctor.userId.firstName} ${doctor.userId.lastName}`.toLowerCase();
      return fullName.includes(search.toLowerCase());
    });
  }

  const count = await Doctor.countDocuments(query);

  res.json({
    success: true,
    data: filteredDoctors,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalDoctors: count,
    },
  });
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate('userId', 'firstName lastName email phone profilePicture');

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  res.json({
    success: true,
    data: doctor,
  });
});

// @desc    Get logged-in doctor's profile
// @route   GET /api/doctors/profile
// @access  Private/Doctor
exports.getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user.id })
    .populate('userId', 'firstName lastName email phone profilePicture dateOfBirth gender address');

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  res.json({
    success: true,
    data: doctor,
  });
});

// @desc    Get doctor by user ID
// @route   GET /api/doctors/user/:userId
// @access  Public
exports.getDoctorByUserId = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.params.userId })
    .populate('userId', 'firstName lastName email phone profilePicture');

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  res.json({
    success: true,
    data: doctor,
  });
});

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private (Doctor)
exports.updateAvailability = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check if the logged-in user owns this doctor profile
  if (doctor.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this doctor profile');
  }

  doctor.availability = req.body.availability;
  const updatedDoctor = await doctor.save();

  res.json({
    success: true,
    data: updatedDoctor,
  });
});

// @desc    Get doctor's appointments
// @route   GET /api/doctors/:id/appointments
// @access  Private (Doctor)
exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check authorization
  if (doctor.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view these appointments');
  }

  const { status, date } = req.query;
  let query = { doctorId: req.params.id };

  if (status) {
    query.status = status;
  }

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.appointmentDate = { $gte: startDate, $lt: endDate };
  }

  const appointments = await Appointment.find(query)
    .populate('patientId', 'firstName lastName email phone')
    .sort({ appointmentDate: 1 });

  res.json({
    success: true,
    data: appointments,
  });
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id/profile
// @access  Private (Doctor)
exports.updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check authorization
  if (doctor.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this profile');
  }

  // Update fields
  doctor.specialization = req.body.specialization || doctor.specialization;
  doctor.qualifications = req.body.qualifications || doctor.qualifications;
  doctor.experience = req.body.experience || doctor.experience;
  doctor.consultationFee = req.body.consultationFee || doctor.consultationFee;
  doctor.biography = req.body.biography || doctor.biography;

  const updatedDoctor = await doctor.save();

  res.json({
    success: true,
    data: updatedDoctor,
  });
});

// @desc    Get doctor statistics
// @route   GET /api/doctors/:id/stats
// @access  Private (Doctor)
exports.getDoctorStats = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check authorization
  if (doctor.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const totalAppointments = await Appointment.countDocuments({ doctorId: req.params.id });
  const completedAppointments = await Appointment.countDocuments({ 
    doctorId: req.params.id, 
    status: 'completed' 
  });
  const upcomingAppointments = await Appointment.countDocuments({ 
    doctorId: req.params.id, 
    status: 'confirmed',
    appointmentDate: { $gte: new Date() }
  });

  res.json({
    success: true,
    data: {
      totalAppointments,
      completedAppointments,
      upcomingAppointments,
      totalPatients: doctor.patients.length,
      rating: doctor.rating,
      totalRatings: doctor.totalRatings,
    },
  });
});
