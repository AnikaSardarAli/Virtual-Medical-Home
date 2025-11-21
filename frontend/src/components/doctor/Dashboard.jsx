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
      <Box 
        sx={{ 
          mb: 5,
          p: { xs: 3, md: 4 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Typography 
          variant="h3" 
          gutterBottom
          fontWeight="bold"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Welcome, Dr. {user?.firstName}! 👨‍⚕️
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Here's your dashboard overview for today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: 160,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Today's Appointments
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {stats.todayAppointments}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Scheduled
                </Typography>
              </Box>
              <CalendarIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: 160,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              color: 'white',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(240, 147, 251, 0.4)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Total Patients
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {stats.totalPatients}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Under Care
                </Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: 160,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
              color: 'white',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(79, 172, 254, 0.4)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Rating
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {stats.rating.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  ⭐ Average
                </Typography>
              </Box>
              <StarIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: 160,
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
              color: 'white',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(250, 112, 154, 0.4)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Pending
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {stats.pendingAppointments}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  To Review
                </Typography>
              </Box>
              <PendingIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Appointments */}
      <Card 
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'grey.200',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700}>
              Upcoming Appointments
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/doctor/appointments')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              View All →
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          {recentAppointments.length === 0 ? (
            <Box 
              sx={{ 
                py: 8, 
                textAlign: 'center',
                bgcolor: 'grey.50',
                borderRadius: 2,
              }}
            >
              <CalendarIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" fontWeight={600}>
                No upcoming appointments
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Your schedule is clear for now
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {recentAppointments.map((appointment, index) => (
                <Box key={appointment._id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{
                      py: 2,
                      px: 2,
                      borderRadius: 2,
                      transition: 'background 0.2s ease',
                      '&:hover': {
                        bgcolor: 'grey.50',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main',
                          width: 56,
                          height: 56,
                          fontSize: '1.5rem',
                          fontWeight: 700,
                        }}
                      >
                        {appointment.patientId?.firstName?.[0]}
                        {appointment.patientId?.lastName?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Typography variant="h6" fontWeight={700}>
                            {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="medium"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography 
                            variant="body1" 
                            color="text.primary"
                            sx={{ mt: 1, fontWeight: 500 }}
                          >
                            📅 {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            🕐 {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                          </Typography>
                          {appointment.reason && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                mt: 1,
                                p: 1.5,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                borderLeft: '3px solid',
                                borderColor: 'primary.main',
                              }}
                            >
                              <strong>Reason:</strong> {appointment.reason}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentAppointments.length - 1 && <Divider sx={{ my: 1 }} />}
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
