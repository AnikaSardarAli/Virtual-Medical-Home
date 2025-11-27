import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  VideoCall,
  Chat,
  Person,
  LocalHospital,
  Star,
  AttachMoney,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    type: 'video',
    symptoms: '',
  });

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  useEffect(() => {
    // Only update slots if we have a complete valid date (YYYY-MM-DD format)
    if (selectedDate && doctor && selectedDate.length === 10 && selectedDate.includes('-')) {
      console.log('Valid date detected, updating slots');
      try {
        updateAvailableSlots();
      } catch (error) {
        console.error('Error updating available slots:', error);
      }
    }
  }, [selectedDate, doctor]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/doctors/${doctorId}`);
      setDoctor(response.data.data);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      toast.error('Failed to load doctor details');
      navigate('/patient/doctors');
    } finally {
      setLoading(false);
    }
  };

  const updateAvailableSlots = () => {
    try {
      if (!selectedDate || !doctor) {
        console.log('Missing date or doctor data');
        return;
      }

      // Validate date format and that it's a valid date
      const date = new Date(selectedDate);
      if (isNaN(date.getTime())) {
        console.log('Invalid date:', selectedDate);
        return;
      }

      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      setSelectedDay(dayName);
    
      console.log('Looking for slots on:', dayName);
      console.log('Doctor availability:', doctor.availability);

      const dayAvailability = doctor.availability?.find(
        (avail) => avail.day === dayName
      );

      if (dayAvailability && dayAvailability.slots) {
        console.log('Found slots:', dayAvailability.slots);
        setAvailableSlots(dayAvailability.slots);
      } else {
        console.log('No slots found for', dayName);
        setAvailableSlots([]);
        toast.info(`Dr. ${doctor.userId?.firstName} ${doctor.userId?.lastName} is not available on ${dayName}. Please try another date.`);
      }
    } catch (error) {
      console.error('Error in updateAvailableSlots:', error);
      // Don't crash the page, just log the error
    }
  };

  const handleDateChange = (e) => {
    const dateInput = e.target.value;
    console.log('Date input received:', dateInput);
    
    // The input type="date" returns YYYY-MM-DD format
    // But if user's browser shows DD/MM/YYYY, it still sends YYYY-MM-DD
    setSelectedDate(dateInput);
    console.log('Date set to:', dateInput);
  };  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    if (!appointmentData.symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    try {
      setSubmitting(true);

      const bookingData = {
        doctorId: doctor._id,
        appointmentDate: selectedDate,
        timeSlot: {
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
        symptoms: appointmentData.symptoms,
        type: appointmentData.type,
      };

      const response = await api.post('/api/appointments', bookingData);

      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/patient/appointments');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months in advance
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!doctor) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Doctor not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/patient/doctors')}
        sx={{ mb: 2 }}
      >
        Back to Doctors
      </Button>

      <Typography variant="h4" gutterBottom fontWeight="bold">
        Book Appointment
      </Typography>

      <Grid container spacing={3}>
        {/* Doctor Information Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  <LocalHospital sx={{ fontSize: 50 }} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Dr. {doctor.userId?.firstName} {doctor.userId?.lastName}
                </Typography>
                <Chip
                  label={doctor.specialization}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Star sx={{ color: '#ffc107', mr: 1 }} />
                  <Typography variant="body2">
                    <strong>{doctor.rating?.toFixed(1) || 'N/A'}</strong> ({doctor.reviewCount || 0} reviews)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="body2">
                    <strong>${doctor.consultationFee}</strong> consultation fee
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ color: 'info.main', mr: 1 }} />
                  <Typography variant="body2">
                    <strong>{doctor.experience}</strong> years experience
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                <strong>About:</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {doctor.biography}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                <strong>Qualifications:</strong>
              </Typography>
              {doctor.qualifications?.map((qual, index) => (
                <Chip
                  key={index}
                  label={qual}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1, mr: 1 }}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Appointment Details
            </Typography>

            {/* Progress Indicator */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                  <Chip 
                    label="1. Date" 
                    color={selectedDate ? "success" : "default"}
                    icon={selectedDate ? <CheckCircle /> : <CalendarMonth />}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Chip 
                    label="2. Time" 
                    color={selectedSlot ? "success" : "default"}
                    icon={selectedSlot ? <CheckCircle /> : <AccessTime />}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Chip 
                    label="3. Type" 
                    color={appointmentData.type ? "success" : "default"}
                    icon={appointmentData.type ? <CheckCircle /> : <VideoCall />}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Chip 
                    label="4. Symptoms" 
                    color={appointmentData.symptoms.trim() ? "success" : "default"}
                    icon={appointmentData.symptoms.trim() ? <CheckCircle /> : <Person />}
                    sx={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit}>
              {/* Date Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  <CalendarMonth sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Step 1: Select Appointment Date
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  label="Appointment Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  InputLabelProps={{ 
                    shrink: true,
                  }}
                  inputProps={{
                    min: getMinDate(),
                    max: getMaxDate(),
                  }}
                  helperText="Select a date to view available time slots"
                  required
                />
              </Box>

              {/* Time Slot Selection */}
              {selectedDate && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    <AccessTime sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Step 2: Available Time Slots for {selectedDay}
                  </Typography>
                  {availableSlots.length > 0 ? (
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Click on a time slot to select it:
                      </Typography>
                      <Grid container spacing={2}>
                        {availableSlots.map((slot, index) => (
                          <Grid item xs={6} sm={4} md={3} key={index}>
                            <Button
                              fullWidth
                              variant={
                                selectedSlot?.startTime === slot.startTime
                                  ? 'contained'
                                  : 'outlined'
                              }
                              color={
                                selectedSlot?.startTime === slot.startTime
                                  ? 'success'
                                  : 'primary'
                              }
                              onClick={() => handleSlotSelect(slot)}
                              disabled={slot.isBooked}
                              sx={{ 
                                py: 1.5,
                                fontWeight: selectedSlot?.startTime === slot.startTime ? 'bold' : 'normal',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  transition: 'transform 0.2s',
                                },
                                '&.Mui-disabled': {
                                  bgcolor: '#f0f0f0',
                                }
                              }}
                            >
                              {slot.startTime} - {slot.endTime}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                      {selectedSlot && (
                        <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircle />}>
                          <strong>Selected:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}
                        </Alert>
                      )}
                    </>
                  ) : (
                    <Alert severity="warning">
                      No slots available for {selectedDay}. Please try another date.
                    </Alert>
                  )}
                </Box>
              )}

              {/* Appointment Type */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  <VideoCall sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Step 3: Consultation Type
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    row
                    value={appointmentData.type}
                    onChange={(e) =>
                      setAppointmentData({ ...appointmentData, type: e.target.value })
                    }
                  >
                    <FormControlLabel
                      value="video"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VideoCall sx={{ mr: 0.5 }} />
                          Video Call
                        </Box>
                      }
                      sx={{ 
                        border: appointmentData.type === 'video' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        mr: 2,
                        bgcolor: appointmentData.type === 'video' ? '#e3f2fd' : 'transparent'
                      }}
                    />
                    <FormControlLabel
                      value="chat"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chat sx={{ mr: 0.5 }} />
                          Chat
                        </Box>
                      }
                      sx={{ 
                        border: appointmentData.type === 'chat' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        bgcolor: appointmentData.type === 'chat' ? '#e3f2fd' : 'transparent'
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* Symptoms */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Step 4: Describe Your Symptoms
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Symptoms or Reason for Visit"
                  value={appointmentData.symptoms}
                  onChange={(e) =>
                    setAppointmentData({ ...appointmentData, symptoms: e.target.value })
                  }
                  placeholder="Please provide details about your health concerns, symptoms, or reason for consultation..."
                  helperText={`${appointmentData.symptoms.length}/500 characters`}
                  inputProps={{ maxLength: 500 }}
                  required
                />
              </Box>

              {/* Summary */}
              {selectedSlot && (
                <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Appointment Summary:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Doctor:</strong> Dr. {doctor.userId?.firstName} {doctor.userId?.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Time:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong> {appointmentData.type === 'video' ? 'Video Call' : 'Chat'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fee:</strong> ${doctor.consultationFee}
                  </Typography>
                </Paper>
              )}

              {/* Submit Button */}
              <Box>
                {!selectedSlot && selectedDate && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Please select a time slot to continue
                  </Alert>
                )}
                {!selectedDate && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Please select a date to see available time slots
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting || !selectedSlot || !appointmentData.symptoms.trim()}
                  sx={{ 
                    py: 1.5,
                    '&.Mui-disabled': {
                      bgcolor: 'action.disabledBackground',
                    }
                  }}
                >
                  {submitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
                {selectedSlot && !appointmentData.symptoms.trim() && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    * Please describe your symptoms to continue
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookAppointment;
