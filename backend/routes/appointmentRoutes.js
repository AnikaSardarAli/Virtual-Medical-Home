const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentDetails,
  addReview,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { appointmentValidation, validate } = require('../utils/validators');

router.post('/', protect, appointmentValidation, validate, bookAppointment);
router.get('/patient/:id', protect, getPatientAppointments);
router.get('/doctor/:id', protect, getDoctorAppointments);
router.put('/:id', protect, updateAppointmentStatus);
router.delete('/:id', protect, cancelAppointment);
router.get('/:id/details', protect, getAppointmentDetails);
router.put('/:id/review', protect, addReview);

module.exports = router;
