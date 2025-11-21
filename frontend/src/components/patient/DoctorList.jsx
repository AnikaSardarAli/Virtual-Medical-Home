import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Rating,
  Divider,
  Paper,
} from '@mui/material';
import {
  Search,
  LocationOn,
  AttachMoney,
  WorkOutline,
  Star,
  CalendarMonth,
} from '@mui/icons-material';
import axios from '../../services/api';
import { toast } from 'react-toastify';

const DoctorList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, specializationFilter, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/doctors?limit=50'); // Increased limit to show all doctors
      const doctorList = response.data.data || [];
      
      // Filter only approved and active doctors
      const activeDoctors = doctorList.filter(
        (doc) => doc.isApproved && (doc.userId?.isActive !== false)
      );
      
      setDoctors(activeDoctors);
      setFilteredDoctors(activeDoctors);

      // Extract unique specializations
      const uniqueSpecs = [...new Set(activeDoctors.map((d) => d.specialization))];
      setSpecializations(uniqueSpecs);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specializationFilter) {
      filtered = filtered.filter((doc) => doc.specialization === specializationFilter);
    }

    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/patient/book-appointment/${doctorId}`);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Find Doctors
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Browse and book appointments with our expert doctors
      </Typography>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name or specialization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Filter by Specialization"
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
            >
              <MenuItem value="">All Specializations</MenuItem>
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Found {filteredDoctors.length} doctor(s)
          </Typography>
        </Box>
      </Paper>

      {/* Doctor Cards */}
      {filteredDoctors.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No doctors found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}
                      src={doctor.userId?.profilePicture}
                    >
                      {doctor.userId?.firstName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        Dr. {doctor.userId?.firstName} {doctor.userId?.lastName}
                      </Typography>
                      <Chip
                        label={doctor.specialization}
                        size="small"
                        color="primary"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WorkOutline sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.experience} years experience
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoney sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        ${doctor.consultationFee} per consultation
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 18, mr: 1, color: 'gold' }} />
                      <Rating
                        value={doctor.rating || 4.5}
                        precision={0.5}
                        size="small"
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({doctor.reviewCount || 0})
                      </Typography>
                    </Box>
                  </Box>

                  {doctor.biography && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {doctor.biography}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<CalendarMonth />}
                    onClick={() => handleBookAppointment(doctor._id)}
                  >
                    Book Appointment
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DoctorList;
