import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  CalendarMonth,
  LocalHospital,
  Description,
  Person,
  CheckCircle,
  Pending,
  Cancel,
} from '@mui/icons-material';
import axios from '../../services/api';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalAppointments: 0,
    prescriptions: 0,
    medicalRecords: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, prescriptionsRes, recordsRes] = await Promise.all([
        axios.get(`/appointments/patient/${user._id}`),
        axios.get(`/prescriptions/patient/${user._id}`),
        axios.get(`/medical-records/patient/${user._id}`),
      ]);

      const appointments = appointmentsRes.data.data || [];
      const upcomingCount = appointments.filter(
        (apt) => apt.status === 'confirmed' || apt.status === 'pending'
      ).length;

      setStats({
        upcomingAppointments: upcomingCount,
        totalAppointments: appointments.length,
        prescriptions: prescriptionsRes.data.data?.length || 0,
        medicalRecords: recordsRes.data.data?.length || 0,
      });

      setRecentAppointments(appointments.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle />;
      case 'pending':
        return <Pending />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <CalendarMonth />;
    }
  };

  const quickActions = [
    {
      title: 'Find Doctors',
      description: 'Browse and search for doctors by specialization',
      icon: <LocalHospital sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => navigate('/patient/doctors'),
    },
    {
      title: 'My Appointments',
      description: 'View and manage your appointments',
      icon: <CalendarMonth sx={{ fontSize: 40, color: 'success.main' }} />,
      action: () => navigate('/patient/appointments'),
    },
    {
      title: 'Medical Records',
      description: 'Access your medical history and documents',
      icon: <Description sx={{ fontSize: 40, color: 'info.main' }} />,
      action: () => navigate('/patient/medical-records'),
    },
    {
      title: 'My Profile',
      description: 'Update your personal information',
      icon: <Person sx={{ fontSize: 40, color: 'warning.main' }} />,
      action: () => navigate('/patient/profile'),
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
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
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Here's your health overview for today
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
                  Upcoming
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {stats.upcomingAppointments}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Appointments
                </Typography>
              </Box>
              <CalendarMonth sx={{ fontSize: 48, opacity: 0.3 }} />
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
                  Total
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {stats.totalAppointments}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Consultations
                </Typography>
              </Box>
              <LocalHospital sx={{ fontSize: 48, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            onClick={() => navigate('/patient/prescriptions')}
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
                  Prescriptions
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {stats.prescriptions}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Available
                </Typography>
              </Box>
              <Description sx={{ fontSize: 48, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 160,
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(67, 233, 123, 0.4)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Medical Records
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {stats.medicalRecords}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Documents
                </Typography>
              </Box>
              <Description sx={{ fontSize: 48, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ mt: 6, mb: 3, fontWeight: 700 }}
      >
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'grey.200',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  borderColor: 'primary.main',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                },
              }}
              onClick={action.action}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box 
                  sx={{ 
                    mb: 2,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                  }}
                >
                  {action.icon}
                </Box>
                <Typography 
                  gutterBottom 
                  variant="h6" 
                  component="div"
                  fontWeight={700}
                >
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button 
                  size="large" 
                  variant="contained"
                  onClick={action.action}
                  sx={{ 
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Go Now →
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Appointments */}
      {recentAppointments.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            fontWeight={700}
            sx={{ mb: 3 }}
          >
            Recent Appointments
          </Typography>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              border: '2px solid',
              borderColor: 'grey.200',
            }}
          >
            <List>
              {recentAppointments.map((appointment, index) => (
                <div key={appointment._id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      transition: 'background 0.2s ease',
                      '&:hover': {
                        bgcolor: 'grey.50',
                      },
                    }}
                    secondaryAction={
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="medium"
                        icon={getStatusIcon(appointment.status)}
                        sx={{ 
                          fontWeight: 600,
                          px: 1,
                        }}
                      />
                    }
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
                        {appointment.doctorId?.userId?.firstName?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight={700}>
                          Dr. {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography 
                            component="span" 
                            variant="body1" 
                            color="primary"
                            fontWeight={600}
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {appointment.doctorId?.specialization}
                          </Typography>
                          <Typography 
                            component="span" 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            📅 {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                          <Typography 
                            component="span" 
                            variant="body2" 
                            color="text.secondary"
                          >
                            🕐 {appointment.timeSlot?.startTime}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentAppointments.length - 1 && (
                    <Divider variant="inset" component="li" sx={{ ml: 9 }} />
                  )}
                </div>
              ))}
            </List>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/patient/appointments')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  borderWidth: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                View All Appointments →
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default PatientDashboard;
