import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Event as EventIcon,
  PendingActions as PendingIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: analytics?.users?.total || 0,
      subtitle: `${analytics?.users?.patients || 0} Patients`,
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Doctors',
      value: analytics?.users?.doctors || 0,
      subtitle: 'Approved',
      icon: <HospitalIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Appointments',
      value: analytics?.appointments?.total || 0,
      subtitle: `${analytics?.appointments?.completed || 0} Completed`,
      icon: <EventIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Pending Approvals',
      value: analytics?.users?.pendingDoctors || 0,
      subtitle: 'Doctor Applications',
      icon: <PendingIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      onClick: () => navigate('/admin/doctor-approvals'),
    },
  ];

  const secondaryStats = [
    {
      label: 'Upcoming Appointments',
      value: analytics?.appointments?.upcoming || 0,
      icon: <ScheduleIcon />,
      color: 'info',
    },
    {
      label: 'Cancelled Appointments',
      value: analytics?.appointments?.cancelled || 0,
      icon: <CancelIcon />,
      color: 'error',
    },
    {
      label: 'Total Prescriptions',
      value: analytics?.prescriptions?.total || 0,
      icon: <DescriptionIcon />,
      color: 'success',
    },
    {
      label: 'Total Revenue',
      value: `$${analytics?.revenue?.total?.toLocaleString() || 0}`,
      icon: <MoneyIcon />,
      color: 'warning',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
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
          Admin Dashboard 👑
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Platform Management & Analytics
        </Typography>
      </Box>

      {/* Main Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: 180,
                background: stat.gradient,
                color: 'white',
                borderRadius: 3,
                cursor: stat.onClick ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                '&:hover': stat.onClick ? {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                } : {},
              }}
              onClick={stat.onClick}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {stat.subtitle}
                  </Typography>
                </Box>
                <Box sx={{ opacity: 0.3 }}>
                  {stat.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Secondary Statistics */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '2px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              Platform Overview
            </Typography>
            <Grid container spacing={3}>
              {secondaryStats.map((stat, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: `${stat.color}.main`,
                          width: 50,
                          height: 50,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '2px solid',
              borderColor: 'grey.200',
              height: '100%',
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<PendingIcon />}
                onClick={() => navigate('/admin/doctor-approvals')}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Review Approvals
                {analytics?.users?.pendingDoctors > 0 && (
                  <Chip
                    label={analytics.users.pendingDoctors}
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: 'error.main',
                      color: 'white',
                      fontWeight: 700,
                    }}
                  />
                )}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/admin/users')}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                Manage Users
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<TrendingUpIcon />}
                onClick={() => navigate('/admin/analytics')}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                View Analytics
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Appointments */}
        {analytics?.recentAppointments && analytics.recentAppointments.length > 0 && (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'grey.200',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                  Recent Appointments
                </Typography>
                <Button variant="text" onClick={() => navigate('/admin/analytics')}>
                  View All →
                </Button>
              </Box>
              <List sx={{ p: 0 }}>
                {analytics.recentAppointments.slice(0, 5).map((appointment, index) => (
                  <Box key={appointment._id}>
                    <ListItem
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'grey.50',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {appointment.patientId?.firstName?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" fontWeight={600}>
                              {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              →
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Dr. {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                            </Typography>
                            <Chip
                              label={appointment.status}
                              size="small"
                              color={
                                appointment.status === 'completed' ? 'success' :
                                appointment.status === 'confirmed' ? 'info' :
                                appointment.status === 'pending' ? 'warning' : 'error'
                              }
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={new Date(appointment.appointmentDate).toLocaleDateString()}
                      />
                    </ListItem>
                    {index < Math.min(analytics.recentAppointments.length - 1, 4) && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
