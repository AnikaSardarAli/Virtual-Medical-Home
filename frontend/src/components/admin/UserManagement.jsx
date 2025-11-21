import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from '../../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [stats, setStats] = useState({ patients: 0, doctors: 0, admins: 0 });

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, roleFilter, statusFilter]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      // Fetch all users to get accurate counts
      const response = await axios.get('/admin/users', { params: { limit: 1000 } });
      const allUsers = response.data.data || [];
      
      setStats({
        patients: allUsers.filter(u => u.role === 'patient').length,
        doctors: allUsers.filter(u => u.role === 'doctor').length,
        admins: allUsers.filter(u => u.role === 'admin').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }

      if (statusFilter !== 'all') {
        params.isActive = statusFilter === 'active';
      }

      const response = await axios.get('/admin/users', { params });
      setUsers(response.data.data || []);
      setTotalUsers(response.data.pagination?.totalUsers || 0);
      
      // Update stats after fetching
      fetchAllStats();
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/admin/users/${deleteDialog.user._id}`);
      toast.success('User deleted successfully');
      setDeleteDialog({ open: false, user: null });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'doctor':
        return 'primary';
      case 'patient':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredUsers = users.filter((user) =>
    searchTerm === ''
      ? true
      : `${user.firstName} ${user.lastName} ${user.email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
  );

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
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          User Management 👥
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Manage all platform users, roles, and permissions
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '2px solid',
              borderColor: 'grey.200',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {totalUsers}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '2px solid',
              borderColor: 'success.main',
              borderRadius: 2,
              bgcolor: 'success.50',
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Patients
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="success.main">
              {stats.patients}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '2px solid',
              borderColor: 'primary.main',
              borderRadius: 2,
              bgcolor: 'primary.50',
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Doctors
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              {stats.doctors}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '2px solid',
              borderColor: 'error.main',
              borderRadius: 2,
              bgcolor: 'error.50',
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Admins
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="error.main">
              {stats.admins}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '2px solid', borderColor: 'grey.200' }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="patient">Patients</MenuItem>
                <MenuItem value="doctor">Doctors</MenuItem>
                <MenuItem value="admin">Admins</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              sx={{ height: 56 }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '2px solid', borderColor: 'grey.200' }}>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No users found
              </Typography>
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      sx={{
                        '&:hover': { bgcolor: 'grey.50' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={user.profilePicture}
                            sx={{
                              bgcolor: user.isActive ? 'primary.main' : 'grey.400',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {user.firstName?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {user._id.slice(-8)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.toUpperCase()}
                          color={getRoleColor(user.role)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={user.isActive ? <ActiveIcon /> : <BlockIcon />}
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'default'}
                          size="small"
                          variant={user.isActive ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'}>
                          <IconButton
                            color={user.isActive ? 'error' : 'success'}
                            onClick={() => handleToggleStatus(user._id, user.isActive)}
                            size="small"
                          >
                            {user.isActive ? <BlockIcon /> : <ActiveIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, user })}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={totalUsers}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user{' '}
            <strong>
              {deleteDialog.user?.firstName} {deleteDialog.user?.lastName}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
