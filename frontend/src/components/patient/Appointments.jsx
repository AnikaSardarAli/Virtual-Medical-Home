import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  CheckCircle,
  Pending,
  Cancel,
  VideoCall,
  Description,
} from '@mui/icons-material';
import axios from '../../services/api';
import toast from 'react-hot-toast';

const Appointments = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/appointments/patient/${user._id}`);
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      await axios.delete(`/appointments/${selectedAppointment._id}`, {
        data: { reason: cancelReason },
      });
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
      setCancelDialog(false);
      setCancelReason('');
      setSelectedAppointment(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      completed: 'info',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Pending />,
      confirmed: <CheckCircle />,
      completed: <CheckCircle />,
      cancelled: <Cancel />,
    };
    return icons[status] || <CalendarMonth />;
  };

  const filterAppointments = (status) => {
    switch (status) {
      case 'upcoming':
        return appointments.filter(
          (apt) => apt.status === 'confirmed' || apt.status === 'pending'
        );
      case 'past':
        return appointments.filter(
          (apt) => apt.status === 'completed' || apt.status === 'cancelled'
        );
      default:
        return appointments;
    }
  };

  const getFilteredAppointments = () => {
    switch (tabValue) {
      case 1:
        return filterAppointments('upcoming');
      case 2:
        return filterAppointments('past');
      default:
        return appointments;
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        My Appointments
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your appointments and consultations
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label={`All (${appointments.length})`} />
          <Tab label={`Upcoming (${filterAppointments('upcoming').length})`} />
          <Tab label={`Past (${filterAppointments('past').length})`} />
        </Tabs>
      </Paper>

      {filteredAppointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CalendarMonth sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No appointments found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Book your first appointment with our expert doctors
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredAppointments.map((appointment) => (
            <Grid item xs={12} key={appointment._id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar
                        sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                        src={appointment.doctorId?.userId?.profilePicture}
                      >
                        {appointment.doctorId?.userId?.firstName?.charAt(0)}
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6">
                          Dr. {appointment.doctorId?.userId?.firstName}{' '}
                          {appointment.doctorId?.userId?.lastName}
                        </Typography>
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          size="small"
                          icon={getStatusIcon(appointment.status)}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {appointment.doctorId?.specialization}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarMonth fontSize="small" color="action" />
                          <Typography variant="body2">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2">
                            {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <VideoCall fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {appointment.type} Consultation
                          </Typography>
                        </Box>
                      </Box>

                      {appointment.symptoms && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" fontWeight="medium">
                            Symptoms:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.symptoms}
                          </Typography>
                        </Box>
                      )}

                      {appointment.consultationNotes && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" fontWeight="medium">
                            Consultation Notes:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.consultationNotes}
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    <Grid item>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {appointment.status === 'confirmed' && (
                          <Button
                            variant="contained"
                            startIcon={<VideoCall />}
                            size="small"
                          >
                            Join Call
                          </Button>
                        )}
                        {appointment.prescriptionId && (
                          <Button
                            variant="outlined"
                            startIcon={<Description />}
                            size="small"
                          >
                            View Prescription
                          </Button>
                        )}
                        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setCancelDialog(true);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Are you sure you want to cancel this appointment? Please provide a reason.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Cancellation Reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Close</Button>
          <Button onClick={handleCancelAppointment} color="error" variant="contained">
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments;
