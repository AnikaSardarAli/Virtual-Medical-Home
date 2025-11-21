import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocalHospital as HospitalIcon,
  Description as DescriptionIcon,
  VideoCall as VideoIcon,
  Home as HomeIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from '../../services/api';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: null,
    timeSlot: { startTime: '', endTime: '' },
    symptoms: '',
    type: 'video',
  });
  const [errors, setErrors] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);

  const steps = ['Select Doctor', 'Choose Date & Time', 'Enter Details', 'Confirm'];

  // Time slots
  const timeSlots = [
    { startTime: '09:00', endTime: '09:30' },
    { startTime: '09:30', endTime: '10:00' },
    { startTime: '10:00', endTime: '10:30' },
    { startTime: '10:30', endTime: '11:00' },
    { startTime: '11:00', endTime: '11:30' },
    { startTime: '11:30', endTime: '12:00' },
    { startTime: '14:00', endTime: '14:30' },
    { startTime: '14:30', endTime: '15:00' },
    { startTime: '15:00', endTime: '15:30' },
    { startTime: '15:30', endTime: '16:00' },
    { startTime: '16:00', endTime: '16:30' },
    { startTime: '16:30', endTime: '17:00' },
  ];

  useEffect(() => {
    fetchDoctors();
    // Check if doctor was pre-selected from DoctorList
    if (location.state?.doctorId) {
      setFormData(prev => ({ ...prev, doctorId: location.state.doctorId }));
    }
  }, [location.state]);

  useEffect(() => {
    if (formData.doctorId) {
      const doctor = doctors.find(d => d._id === formData.doctorId);
      setSelectedDoctor(doctor);
    }
  }, [formData.doctorId, doctors]);

  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      fetchAvailableSlots();
    }
  }, [formData.doctorId, formData.appointmentDate]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/doctors?limit=100');
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(
        `/appointments/doctor/${formData.doctorId}?date=${formData.appointmentDate.toISOString()}`
      );
      const bookedAppointments = response.data.data || [];
      
      // Filter out booked slots
      const bookedSlots = bookedAppointments
        .filter(apt => apt.status === 'pending' || apt.status === 'confirmed')
        .map(apt => apt.timeSlot.startTime);
      
      const available = timeSlots.filter(slot => !bookedSlots.includes(slot.startTime));
      setAvailableSlots(available);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots(timeSlots);
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0 && !formData.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }

    if (activeStep === 1) {
      if (!formData.appointmentDate) {
        newErrors.appointmentDate = 'Please select a date';
      }
      if (!formData.timeSlot.startTime) {
        newErrors.timeSlot = 'Please select a time slot';
      }
    }

    if (activeStep === 2 && !formData.symptoms.trim()) {
      newErrors.symptoms = 'Please describe your symptoms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const response = await axios.post('/appointments', formData);
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Select a Doctor
            </Typography>
            <Grid container spacing={2}>
              {doctors.length === 0 ? (
                <Grid item xs={12}>
                  <Alert severity="info">No doctors available at the moment.</Alert>
                </Grid>
              ) : (
                doctors.map((doctor) => (
                  <Grid item xs={12} sm={6} key={doctor._id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: formData.doctorId === doctor._id ? 'primary.main' : 'grey.200',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => setFormData({ ...formData, doctorId: doctor._id })}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={doctor.userId?.profilePicture}
                            sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}
                          >
                            {doctor.userId?.firstName?.[0]}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={700}>
                              Dr. {doctor.userId?.firstName} {doctor.userId?.lastName}
                            </Typography>
                            <Chip
                              label={doctor.specialization}
                              size="small"
                              color="primary"
                              sx={{ mt: 0.5 }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              💼 {doctor.experience} years exp.
                            </Typography>
                            <Typography variant="body2" color="primary" fontWeight={600}>
                              💰 ${doctor.consultationFee}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
            {errors.doctorId && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.doctorId}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Choose Date & Time
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Appointment Date"
                    value={formData.appointmentDate}
                    onChange={(newDate) => {
                      setFormData({ ...formData, appointmentDate: newDate });
                      setErrors({ ...errors, appointmentDate: '' });
                    }}
                    minDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.appointmentDate,
                        helperText: errors.appointmentDate,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                  Available Time Slots
                </Typography>
                <Grid container spacing={2}>
                  {formData.appointmentDate ? (
                    availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <Grid item xs={6} sm={4} md={3} key={slot.startTime}>
                          <Button
                            fullWidth
                            variant={
                              formData.timeSlot.startTime === slot.startTime
                                ? 'contained'
                                : 'outlined'
                            }
                            onClick={() => {
                              setFormData({ ...formData, timeSlot: slot });
                              setErrors({ ...errors, timeSlot: '' });
                            }}
                            sx={{ py: 1.5 }}
                          >
                            <TimeIcon sx={{ mr: 1, fontSize: 18 }} />
                            {slot.startTime}
                          </Button>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Alert severity="warning">No slots available for this date.</Alert>
                      </Grid>
                    )
                  ) : (
                    <Grid item xs={12}>
                      <Alert severity="info">Please select a date first.</Alert>
                    </Grid>
                  )}
                </Grid>
                {errors.timeSlot && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.timeSlot}
                  </Alert>
                )}
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Appointment Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                    Consultation Type
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <FormControlLabel
                      value="video"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VideoIcon />
                          <span>Video Call</span>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="in-person"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HospitalIcon />
                          <span>In-Person</span>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Describe Your Symptoms"
                  placeholder="Please describe your symptoms, concerns, or reason for the appointment..."
                  value={formData.symptoms}
                  onChange={(e) => {
                    setFormData({ ...formData, symptoms: e.target.value });
                    setErrors({ ...errors, symptoms: '' });
                  }}
                  error={!!errors.symptoms}
                  helperText={errors.symptoms}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Confirm Your Appointment
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '2px solid',
                borderColor: 'grey.200',
                borderRadius: 2,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={selectedDoctor?.userId?.profilePicture}
                      sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
                    >
                      {selectedDoctor?.userId?.firstName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        Dr. {selectedDoctor?.userId?.firstName} {selectedDoctor?.userId?.lastName}
                      </Typography>
                      <Chip
                        label={selectedDoctor?.specialization}
                        color="primary"
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarIcon color="primary" />
                    <Typography variant="body1" fontWeight={600}>
                      Date
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {formData.appointmentDate?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TimeIcon color="primary" />
                    <Typography variant="body1" fontWeight={600}>
                      Time
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {formData.timeSlot.startTime} - {formData.timeSlot.endTime}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {formData.type === 'video' ? (
                      <VideoIcon color="primary" />
                    ) : (
                      <HospitalIcon color="primary" />
                    )}
                    <Typography variant="body1" fontWeight={600}>
                      Type
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {formData.type === 'video' ? 'Video Call' : 'In-Person'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="body1" fontWeight={600}>
                      💰 Consultation Fee
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="primary" fontWeight={700}>
                    ${selectedDoctor?.consultationFee}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <DescriptionIcon color="primary" />
                    <Typography variant="body1" fontWeight={600}>
                      Symptoms
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {formData.symptoms}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Book Appointment 📅
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Schedule your consultation with our expert doctors
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'grey.200',
        }}
      >
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>{renderStepContent()}</Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            size="large"
            sx={{ px: 4 }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/patient/doctors')}
              sx={{ px: 4 }}
            >
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
                sx={{ px: 4 }}
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleNext}
                sx={{ px: 4 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookAppointment;
