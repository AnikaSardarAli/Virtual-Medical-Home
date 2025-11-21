import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    specialization: '',
    qualifications: '',
    experience: '',
    consultationFee: '',
    biography: '',
  });

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/doctors/user/${user._id}`);
      const doctor = response.data.data;
      setDoctorData(doctor);
      
      setProfileData({
        firstName: doctor.userId?.firstName || '',
        lastName: doctor.userId?.lastName || '',
        email: doctor.userId?.email || '',
        phoneNumber: doctor.userId?.phoneNumber || '',
        specialization: doctor.specialization || '',
        qualifications: doctor.qualifications?.join(', ') || '',
        experience: doctor.experience || '',
        consultationFee: doctor.consultationFee || '',
        biography: doctor.biography || '',
      });
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update user info
      await api.put('/users/profile', {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
      });

      // Update doctor info
      await api.put(`/doctors/${doctorData._id}/profile`, {
        specialization: profileData.specialization,
        qualifications: profileData.qualifications.split(',').map((q) => q.trim()),
        experience: parseInt(profileData.experience),
        consultationFee: parseInt(profileData.consultationFee),
        biography: profileData.biography,
      });

      toast.success('Profile updated successfully');
      setEditing(false);
      fetchDoctorProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchDoctorProfile();
  };

  if (loading && !doctorData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">My Profile</Typography>
          {!editing ? (
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Save'}
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Avatar & Rating */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'primary.main',
              fontSize: '3rem',
              mb: 2,
            }}
          >
            {profileData.firstName?.[0]}
            {profileData.lastName?.[0]}
          </Avatar>
          <Typography variant="h5">
            Dr. {profileData.firstName} {profileData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {profileData.specialization}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon sx={{ color: 'gold' }} />
            <Typography variant="h6">{doctorData?.rating?.toFixed(1) || '0.0'}</Typography>
            <Typography variant="body2" color="text.secondary">
              ({doctorData?.reviewCount || 0} reviews)
            </Typography>
          </Box>
          {doctorData?.isApproved ? (
            <Chip label="Verified" color="success" sx={{ mt: 1 }} />
          ) : (
            <Chip label="Pending Approval" color="warning" sx={{ mt: 1 }} />
          )}
        </Box>

        {/* Profile Information */}
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      disabled={!editing}
                      variant={editing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      disabled={!editing}
                      variant={editing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      variant="filled"
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleChange}
                      disabled={!editing}
                      variant={editing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Professional Information
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Specialization"
                      name="specialization"
                      value={profileData.specialization}
                      onChange={handleChange}
                      disabled={!editing}
                      variant={editing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Qualifications"
                      name="qualifications"
                      value={profileData.qualifications}
                      onChange={handleChange}
                      disabled={!editing}
                      variant={editing ? 'outlined' : 'filled'}
                      helperText="Separate multiple qualifications with commas"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Experience (years)"
                      name="experience"
                      type="number"
                      value={profileData.experience}
                      onChange={handleChange}
                      disabled={!editing}
                      variant={editing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Consultation Fee ($)"
                      name="consultationFee"
                      type="number"
                      value={profileData.consultationFee}
                      onChange={handleChange}
                      disabled={!editing}
                      variant={editing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Biography"
                      name="biography"
                      value={profileData.biography}
                      onChange={handleChange}
                      disabled={!editing}
                      variant={editing ? 'outlined' : 'filled'}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DoctorProfile;
