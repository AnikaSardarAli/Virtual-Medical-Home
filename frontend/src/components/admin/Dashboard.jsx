import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  People, 
  LocalHospital, 
  Event, 
  PendingActions,
  TrendingUp,
  Assignment,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsRes, statsRes] = await Promise.all([
        api.get('/api/admin/analytics'),
        api.get('/api/admin/stats')
      ]);

      setAnalytics(analyticsRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'primary',
      completed: 'success',
      cancelled: 'error',
      pending: 'warning'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.firstName}! Here's what's happening with your platform today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white',
              '&:hover': { transform: 'translateY(-5px)', transition: 'all 0.3s' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>Total Users</Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.users?.total || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    +{stats?.newUsersToday || 0} today
                  </Typography>
                </Box>
                <People sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              color: 'white',
              '&:hover': { transform: 'translateY(-5px)', transition: 'all 0.3s' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>Doctors</Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.users?.doctors || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    {analytics?.users?.pendingDoctors || 0} pending
                  </Typography>
                </Box>
                <LocalHospital sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
              color: 'white',
              '&:hover': { transform: 'translateY(-5px)', transition: 'all 0.3s' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>Appointments</Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.appointments?.total || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    {stats?.todayAppointments || 0} today
                  </Typography>
                </Box>
                <Event sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
              color: 'white',
              '&:hover': { transform: 'translateY(-5px)', transition: 'all 0.3s' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>Pending Approvals</Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.users?.pendingDoctors || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Doctors awaiting
                  </Typography>
                </Box>
                <PendingActions sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Appointment Statistics
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="#4caf50">
                    {analytics?.appointments?.completed || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                  <Event sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="#2196f3">
                    {analytics?.appointments?.upcoming || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                  <Cancel sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="#f44336">
                    {analytics?.appointments?.cancelled || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Platform Stats
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Active Users</Typography>
                <Typography variant="body1" fontWeight="bold">{stats?.activeUsers || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Verified Users</Typography>
                <Typography variant="body1" fontWeight="bold">{stats?.verifiedUsers || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Patients</Typography>
                <Typography variant="body1" fontWeight="bold">{analytics?.users?.patients || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Prescriptions</Typography>
                <Typography variant="body1" fontWeight="bold">{analytics?.prescriptions?.total || 0}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Appointments */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Recent Appointments
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Patient</strong></TableCell>
                <TableCell><strong>Doctor</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics?.recentAppointments?.length > 0 ? (
                analytics.recentAppointments.map((appointment) => (
                  <TableRow key={appointment._id} hover>
                    <TableCell>
                      {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                    </TableCell>
                    <TableCell>
                      Dr. {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                    </TableCell>
                    <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.status} 
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No recent appointments
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
