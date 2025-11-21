const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration validation
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Appointment validation
const appointmentValidation = [
  body('doctorId').notEmpty().withMessage('Doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid date is required'),
  body('symptoms').notEmpty().withMessage('Symptoms are required'),
];

// Prescription validation
const prescriptionValidation = [
  body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
  body('medicines').isArray({ min: 1 }).withMessage('At least one medicine is required'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  appointmentValidation,
  prescriptionValidation,
};
