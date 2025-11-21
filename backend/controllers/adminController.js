const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, isActive, page = 1, limit = 10 } = req.query;

  let query = {};

  if (role) {
    query.role = role;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const users = await User.find(query)
    .select('-password')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await User.countDocuments(query);

  res.json({
    success: true,
    data: users,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalUsers: count,
    },
  });
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isActive = req.body.isActive;
  const updatedUser = await user.save();

  res.json({
    success: true,
    message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
    data: updatedUser,
  });
});

// @desc    Get pending doctor approvals
// @route   GET /api/admin/doctors/pending
// @access  Private (Admin)
exports.getPendingDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({ isApproved: false })
    .populate('userId', 'firstName lastName email phone profilePicture')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: doctors,
  });
});

// @desc    Approve/Reject doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (Admin)
exports.approveDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  const { isApproved, rejectionReason } = req.body;

  doctor.isApproved = isApproved;

  if (!isApproved && rejectionReason) {
    doctor.rejectionReason = rejectionReason;
  }

  const updatedDoctor = await doctor.save();

  res.json({
    success: true,
    message: `Doctor ${isApproved ? 'approved' : 'rejected'} successfully`,
    data: updatedDoctor,
  });
});

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalPatients = await User.countDocuments({ role: 'patient' });
  const totalDoctors = await Doctor.countDocuments({ isApproved: true });
  const pendingDoctors = await Doctor.countDocuments({ isApproved: false });
  
  const totalAppointments = await Appointment.countDocuments();
  const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
  const upcomingAppointments = await Appointment.countDocuments({ 
    status: 'confirmed',
    appointmentDate: { $gte: new Date() }
  });
  const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

  const totalPrescriptions = await Prescription.countDocuments();

  // Revenue calculation (assuming all completed appointments are paid)
  const revenueData = await Appointment.aggregate([
    { $match: { status: 'completed', paymentStatus: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

  // Recent appointments
  const recentAppointments = await Appointment.find()
    .populate('patientId', 'firstName lastName')
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'firstName lastName' }
    })
    .sort({ createdAt: -1 })
    .limit(10);

  // Monthly appointments trend
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Appointment.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        patients: totalPatients,
        doctors: totalDoctors,
        pendingDoctors,
      },
      appointments: {
        total: totalAppointments,
        completed: completedAppointments,
        upcoming: upcomingAppointments,
        cancelled: cancelledAppointments,
      },
      prescriptions: {
        total: totalPrescriptions,
      },
      revenue: {
        total: totalRevenue,
      },
      recentAppointments,
      monthlyTrend,
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getSystemStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppointments = await Appointment.countDocuments({
    appointmentDate: { $gte: today }
  });

  const newUsersToday = await User.countDocuments({
    createdAt: { $gte: today }
  });

  const activeUsers = await User.countDocuments({ isActive: true });
  const verifiedUsers = await User.countDocuments({ isVerified: true });

  res.json({
    success: true,
    data: {
      todayAppointments,
      newUsersToday,
      activeUsers,
      verifiedUsers,
    },
  });
});
