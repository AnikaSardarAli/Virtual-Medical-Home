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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your health overview for today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6">Upcoming</Typography>
            <Typography variant="h3">{stats.upcomingAppointments}</Typography>
            <Typography variant="body2">Appointments</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h3">{stats.totalAppointments}</Typography>
            <Typography variant="body2">Consultations</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6">Prescriptions</Typography>
            <Typography variant="h3">{stats.prescriptions}</Typography>
            <Typography variant="body2">Available</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6">Medical Records</Typography>
            <Typography variant="h3">{stats.medicalRecords}</Typography>
            <Typography variant="body2">Documents</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{action.icon}</Box>
                <Typography gutterBottom variant="h6" component="div">
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  fullWidth 
                  variant="contained"
                  onClick={action.action}
                  sx={{ py: 1.5 }}
                >
                  Go
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Appointments */}
      {recentAppointments.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Recent Appointments
          </Typography>
          <Paper sx={{ p: 2 }}>
            <List>
              {recentAppointments.map((appointment, index) => (
                <div key={appointment._id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                        icon={getStatusIcon(appointment.status)}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {appointment.doctorId?.userId?.firstName?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          Dr. {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {appointment.doctorId?.specialization}
                          </Typography>
                          {` — ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.timeSlot?.startTime}`}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentAppointments.length - 1 && <Divider variant="inset" component="li" />}
                </div>
              ))}
            </List>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/patient/appointments')}
              >
                View All Appointments
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default PatientDashboard;
