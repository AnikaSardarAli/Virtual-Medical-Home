import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    rating: 0,
    pendingAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch doctor profile to get doctor ID
      const doctorResponse = await api.get(`/doctors/user/${user._id}`);
      const doctorId = doctorResponse.data.data._id;
      
      // Fetch appointments
      const appointmentsResponse = await api.get(`/appointments/doctor/${doctorId}`);
      const appointments = appointmentsResponse.data.data || [];
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayAppts = appointments.filter(
        (apt) => new Date(apt.date).toDateString() === today
      ).length;
      
      const pending = appointments.filter((apt) => apt.status === 'pending').length;
      
      // Get unique patients
      const uniquePatients = [...new Set(appointments.map((apt) => apt.patientId?._id))].length;
      
      setStats({
        todayAppointments: todayAppts,
        totalPatients: uniquePatients,
        rating: doctorResponse.data.data.rating || 0,
        pendingAppointments: pending,
      });
      
      // Set recent appointments (upcoming and today's)
      const upcoming = appointments
        .filter((apt) => new Date(apt.date) >= new Date() && apt.status !== 'cancelled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      
      setRecentAppointments(upcoming);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
        Welcome, Dr. {user?.firstName}!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Here's your dashboard overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Today's Appointments</Typography>
                <Typography variant="h3">{stats.todayAppointments}</Typography>
              </Box>
              <CalendarIcon sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Patients</Typography>
                <Typography variant="h3">{stats.totalPatients}</Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Rating</Typography>
                <Typography variant="h3">{stats.rating.toFixed(1)}</Typography>
              </Box>
              <StarIcon sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Pending</Typography>
                <Typography variant="h3">{stats.pendingAppointments}</Typography>
              </Box>
              <PendingIcon sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Appointments */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Upcoming Appointments</Typography>
            <Button
              size="small"
              onClick={() => navigate('/doctor/appointments')}
            >
              View All
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {recentAppointments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No upcoming appointments
            </Typography>
          ) : (
            <List>
              {recentAppointments.map((appointment, index) => (
                <Box key={appointment._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {appointment.patientId?.firstName?.[0]}
                        {appointment.patientId?.lastName?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(appointment.date).toLocaleDateString()} • {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                          </Typography>
                          {appointment.reason && (
                            <Typography variant="body2" color="text.secondary">
                              Reason: {appointment.reason}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentAppointments.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default DoctorDashboard;
