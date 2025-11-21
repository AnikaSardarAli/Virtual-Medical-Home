import api from './api';

export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getPatientAppointments: async (patientId) => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  },

  getDoctorAppointments: async (doctorId) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  },

  getAppointmentDetails: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}/details`);
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, statusData) => {
    const response = await api.put(`/appointments/${appointmentId}`, statusData);
    return response.data;
  },

  cancelAppointment: async (appointmentId, reason) => {
    const response = await api.delete(`/appointments/${appointmentId}`, {
      data: { reason },
    });
    return response.data;
  },

  addReview: async (appointmentId, reviewData) => {
    const response = await api.put(`/appointments/${appointmentId}/review`, reviewData);
    return response.data;
  },
};

export const doctorService = {
  getDoctors: async (filters = {}) => {
    const response = await api.get('/doctors', { params: filters });
    return response.data;
  },

  getDoctorById: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  registerDoctor: async (doctorData) => {
    const response = await api.post('/doctors/register', doctorData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateAvailability: async (doctorId, availability) => {
    const response = await api.put(`/doctors/${doctorId}/availability`, { availability });
    return response.data;
  },

  updateProfile: async (doctorId, profileData) => {
    const response = await api.put(`/doctors/${doctorId}/profile`, profileData);
    return response.data;
  },

  getDoctorStats: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/stats`);
    return response.data;
  },
};

export const prescriptionService = {
  createPrescription: async (prescriptionData) => {
    const response = await api.post('/prescriptions', prescriptionData);
    return response.data;
  },

  getPatientPrescriptions: async (patientId) => {
    const response = await api.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  },

  getPrescriptionDetails: async (prescriptionId) => {
    const response = await api.get(`/prescriptions/${prescriptionId}`);
    return response.data;
  },

  downloadPrescription: async (prescriptionId) => {
    const response = await api.get(`/prescriptions/${prescriptionId}/download`);
    return response.data;
  },
};

export const medicalRecordService = {
  uploadRecord: async (formData) => {
    const response = await api.post('/medical-records/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getPatientRecords: async (patientId, filters = {}) => {
    const response = await api.get(`/medical-records/patient/${patientId}`, {
      params: filters,
    });
    return response.data;
  },

  deleteRecord: async (recordId) => {
    const response = await api.delete(`/medical-records/${recordId}`);
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },
};
