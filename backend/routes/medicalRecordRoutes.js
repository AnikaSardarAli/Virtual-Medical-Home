const express = require('express');
const router = express.Router();
const {
  uploadMedicalRecord,
  getPatientRecords,
  getRecordDetails,
  deleteRecord,
} = require('../controllers/medicalRecordController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, upload.single('document'), uploadMedicalRecord);
router.get('/patient/:id', protect, getPatientRecords);
router.get('/:id', protect, getRecordDetails);
router.delete('/:id', protect, deleteRecord);

module.exports = router;
