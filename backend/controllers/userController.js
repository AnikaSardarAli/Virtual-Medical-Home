const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // If user is a doctor, get doctor details
  if (user.role === 'doctor') {
    const doctorDetails = await Doctor.findOne({ userId: user._id });
    
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        doctorDetails,
      },
    });
  } else {
    res.json({
      success: true,
      data: user,
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.phone = req.body.phone || user.phone;
  user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
  user.gender = req.body.gender || user.gender;
  user.address = req.body.address || user.address;

  if (req.file) {
    user.profilePicture = req.file.path;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: updatedUser,
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check current password
  const isMatch = await user.comparePassword(req.body.currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Set new password
  user.password = req.body.newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Soft delete - deactivate account
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'Account deactivated successfully',
  });
});
