export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const APPOINTMENT_TYPES = {
  VIDEO: 'video',
  CHAT: 'chat',
  IN_PERSON: 'in-person',
};

export const DOCUMENT_TYPES = {
  LAB_REPORT: 'lab_report',
  PRESCRIPTION: 'prescription',
  SCAN: 'scan',
  XRAY: 'xray',
  OTHER: 'other',
};

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'ENT Specialist',
  'Gastroenterologist',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'Psychiatrist',
  'Gynecologist',
  'Urologist',
  'Ophthalmologist',
  'Dentist',
  'Physiotherapist',
];
