const asyncHandler = require('express-async-handler');
const MedicalRecord = require('../models/MedicalRecord');

// @desc    Upload medical document
// @route   POST /api/medical-records/upload
// @access  Private
exports.uploadMedicalRecord = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const { documentType, description, patientId, appointmentId } = req.body;

  // If uploading for another user, check authorization
  const targetPatientId = patientId || req.user.id;

  if (targetPatientId !== req.user.id && req.user.role !== 'doctor' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to upload records for this patient');
  }

  const medicalRecord = await MedicalRecord.create({
    patientId: targetPatientId,
    documentType,
    fileName: req.file.originalname,
    fileUrl: req.file.path,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    uploadedBy: req.user.id,
    description,
    appointmentId,
  });

  res.status(201).json({
    success: true,
    message: 'Medical record uploaded successfully',
    data: medicalRecord,
  });
});

// @desc    Get patient records
// @route   GET /api/medical-records/patient/:id
// @access  Private
exports.getPatientRecords = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check authorization
  if (req.user.id !== id && req.user.role !== 'doctor' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view these records');
  }

  const { documentType } = req.query;
  let query = { patientId: id };

  if (documentType) {
    query.documentType = documentType;
  }

  const records = await MedicalRecord.find(query)
    .populate('uploadedBy', 'firstName lastName role')
    .populate('appointmentId')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: records,
  });
});

// @desc    Get record details
// @route   GET /api/medical-records/:id
// @access  Private
exports.getRecordDetails = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id)
    .populate('patientId', 'firstName lastName email')
    .populate('uploadedBy', 'firstName lastName role')
    .populate('appointmentId');

  if (!record) {
    res.status(404);
    throw new Error('Medical record not found');
  }

  // Check authorization
  const isPatient = record.patientId._id.toString() === req.user.id;
  const isUploader = record.uploadedBy._id.toString() === req.user.id;

  if (!isPatient && !isUploader && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this record');
  }

  res.json({
    success: true,
    data: record,
  });
});

// @desc    Delete record
// @route   DELETE /api/medical-records/:id
// @access  Private
exports.deleteRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id);

  if (!record) {
    res.status(404);
    throw new Error('Medical record not found');
  }

  // Check authorization
  const isPatient = record.patientId.toString() === req.user.id;

  if (!isPatient && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this record');
  }

  // Delete file from filesystem
  const fs = require('fs');
  if (fs.existsSync(record.fileUrl)) {
    fs.unlinkSync(record.fileUrl);
  }

  await record.deleteOne();

  res.json({
    success: true,
    message: 'Medical record deleted successfully',
  });
});
