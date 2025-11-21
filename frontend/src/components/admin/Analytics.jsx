import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  EventAvailable as AppointmentIcon,
  AttachMoney as RevenueIcon,
  CheckCircle as CompletedIcon,
  HourglassEmpty as PendingIcon,
  Cancel as CancelledIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from '../../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/analytics');
      console.log('Analytics response:', response.data);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!analytics) return;
    
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics data exported successfully!');
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!analytics) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography>No analytics data available</Typography>
      </Container>
    );
  }

  const metrics = [
    {
      title: 'Total Users',
      value: analytics.users?.total || 0,
      icon: <PeopleIcon />,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Total Doctors',
      value: analytics.users?.doctors || 0,
      icon: <DoctorIcon />,
      color: 'success',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Total Appointments',
      value: analytics.appointments?.total || 0,
      icon: <AppointmentIcon />,
      color: 'info',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Pending Approvals',
      value: analytics.users?.pendingDoctors || 0,
      icon: <PendingIcon />,
      color: 'warning',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      title: 'Total Revenue',
      value: `$${(analytics.revenue?.total || 0).toLocaleString()}`,
      icon: <RevenueIcon />,
      color: 'success',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    {
      title: 'Total Prescriptions',
      value: analytics.prescriptions?.total || 0,
      icon: <CompletedIcon />,
      color: 'secondary',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
  ];

  const appointmentStats = [
    {
      label: 'Completed',
      value: analytics.appointments?.completed || 0,
      color: 'success',
      icon: <CompletedIcon />,
    },
    {
      label: 'Upcoming',
      value: analytics.appointments?.upcoming || 0,
      color: 'info',
      icon: <AppointmentIcon />,
    },
    {
      label: 'Pending',
      value: 0, // Not in API response
      color: 'warning',
      icon: <PendingIcon />,
    },
    {
      label: 'Cancelled',
      value: analytics.appointments?.cancelled || 0,
      color: 'error',
      icon: <CancelledIcon />,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Platform Analytics 📊
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Comprehensive insights and metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchAnalytics}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportData}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Export
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                background: metric.gradient,
                color: 'white',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {metric.title}
                  </Typography>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                    {metric.icon}
                  </Avatar>
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Appointment Status Breakdown */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Appointment Status Breakdown
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {appointmentStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  border: '2px solid',
                  borderColor: `${stat.color}.main`,
                  borderRadius: 2,
                  bgcolor: `${stat.color}.50`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ bgcolor: `${stat.color}.main`, width: 40, height: 40 }}>
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={`${stat.color}.main`}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* User Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '2px solid',
              borderColor: 'grey.200',
              height: '100%',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              User Distribution 👥
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'success.50',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'success.main',
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Patients
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active users seeking care
                  </Typography>
                </Box>
                <Chip
                  label={analytics.users?.patients || 0}
                  color="success"
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', px: 2, py: 3 }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'primary.50',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Doctors
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Healthcare providers
                  </Typography>
                </Box>
                <Chip
                  label={analytics.users?.doctors || 0}
                  color="primary"
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', px: 2, py: 3 }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'error.50',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'error.main',
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Admins
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Platform administrators
                  </Typography>
                </Box>
                <Chip
                  label={1}
                  color="error"
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', px: 2, py: 3 }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '2px solid',
              borderColor: 'grey.200',
              height: '100%',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Quick Insights 💡
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.main' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average Revenue per Appointment
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="info.main">
                  ${(analytics.appointments?.total || 0) > 0 
                    ? Math.round((analytics.revenue?.total || 0) / analytics.appointments.total) 
                    : 0}
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.main' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Completion Rate
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {(analytics.appointments?.total || 0) > 0
                    ? Math.round(((analytics.appointments?.completed || 0) / analytics.appointments.total) * 100)
                    : 0}%
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.main' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pending Doctor Approvals
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {analytics.users?.pendingDoctors || 0}
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Monthly Appointments Trend */}
      {analytics.monthlyTrend && analytics.monthlyTrend.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Monthly Appointments Trend 📈
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>
                    <Typography fontWeight="bold">Month</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">Appointments</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.monthlyTrend.map((month, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:hover': { bgcolor: 'grey.50' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={600}>
                        {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={month.count}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Summary */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'grey.200',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Platform Summary 📋
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total Platform Users
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {analytics.users?.total || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Active Doctors
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {analytics.users?.doctors || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total Appointments
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {analytics.appointments?.total || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Platform Revenue
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${(analytics.revenue?.total || 0).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Analytics;
