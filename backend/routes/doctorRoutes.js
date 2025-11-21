const express = require('express');
const router = express.Router();
const {
  registerDoctor,
  getDoctors,
  getDoctorById,
  getDoctorByUserId,
  updateAvailability,
  getDoctorAppointments,
  updateDoctorProfile,
  getDoctorStats,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', protect, authorize('doctor'), upload.array('documents', 5), registerDoctor);
router.get('/', getDoctors);
router.get('/user/:userId', getDoctorByUserId);
router.get('/:id', getDoctorById);
router.put('/:id/availability', protect, authorize('doctor'), updateAvailability);
router.get('/:id/appointments', protect, getDoctorAppointments);
router.put('/:id/profile', protect, authorize('doctor'), updateDoctorProfile);
router.get('/:id/stats', protect, getDoctorStats);

module.exports = router;
