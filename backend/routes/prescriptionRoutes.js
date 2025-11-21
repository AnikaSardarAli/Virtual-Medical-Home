const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPatientPrescriptions,
  getPrescriptionDetails,
  downloadPrescription,
  updatePrescription,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');
const { prescriptionValidation, validate } = require('../utils/validators');

router.post('/', protect, authorize('doctor'), prescriptionValidation, validate, createPrescription);
router.get('/patient/:id', protect, getPatientPrescriptions);
router.get('/:id', protect, getPrescriptionDetails);
router.get('/:id/download', protect, downloadPrescription);
router.put('/:id', protect, authorize('doctor'), updatePrescription);

module.exports = router;
