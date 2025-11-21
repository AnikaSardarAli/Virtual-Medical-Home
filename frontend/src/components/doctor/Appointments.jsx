import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  useEffect(() => {
    filterAppointments();
  }, [activeTab, appointments]);

  const fetchDoctorProfile = async () => {
    try {
      const response = await api.get(`/doctors/user/${user._id}`);
      setDoctorId(response.data.data._id);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      toast.error('Failed to load doctor profile');
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/appointments/doctor/${doctorId}`);
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    const now = new Date();
    let filtered = [];

    switch (activeTab) {
      case 0: // All
        filtered = appointments;
        break;
      case 1: // Pending
        filtered = appointments.filter((apt) => apt.status === 'pending');
        break;
      case 2: // Upcoming
        filtered = appointments.filter(
          (apt) => new Date(apt.date) >= now && apt.status === 'confirmed'
        );
        break;
      case 3: // Completed
        filtered = appointments.filter((apt) => apt.status === 'completed');
        break;
      default:
        filtered = appointments;
    }

    setFilteredAppointments(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}`, {
        status: newStatus,
      });

      if (response.data.success) {
        toast.success(`Appointment ${newStatus} successfully`);
        fetchAppointments();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`All (${appointments.length})`} />
          <Tab label={`Pending (${appointments.filter((a) => a.status === 'pending').length})`} />
          <Tab
            label={`Upcoming (${
              appointments.filter((a) => new Date(a.date) >= new Date() && a.status === 'confirmed').length
            })`}
          />
          <Tab label={`Completed (${appointments.filter((a) => a.status === 'completed').length})`} />
        </Tabs>
      </Paper>

      {filteredAppointments.length === 0 ? (
        <Alert severity="info">No appointments found in this category.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredAppointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        {appointment.patientId?.firstName?.[0]}
                        {appointment.patientId?.lastName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                        </Typography>
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                    </Typography>
                  </Box>

                  {appointment.patientId?.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {appointment.patientId.email}
                      </Typography>
                    </Box>
                  )}

                  {appointment.reason && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Reason:</strong> {appointment.reason}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions>
                  {appointment.status === 'pending' && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleStatusChange(appointment._id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                      <Button
                        size="small"
                        onClick={() => navigate(`/doctor/prescription/${appointment._id}`)}
                      >
                        Create Prescription
                      </Button>
                    </>
                  )}
                  {appointment.status === 'completed' && (
                    <Button
                      size="small"
                      onClick={() => navigate(`/doctor/patient/${appointment.patientId._id}`)}
                    >
                      View Patient Details
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DoctorAppointments;
