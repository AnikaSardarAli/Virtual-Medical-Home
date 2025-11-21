import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LocalHospital,
  CheckCircle,
  Person,
  MedicalServices,
  AdminPanelSettings,
} from '@mui/icons-material';
import { login, clearError, logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient',
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(login(formData)).unwrap();
      
      // Validate if the logged-in user's role matches the selected role
      if (result.role !== formData.role) {
        // Logout the user immediately
        dispatch(logout());
        toast.error(`Invalid credentials. This account is for "${result.role}" role. Please select the correct role.`);
        return;
      }
      
      toast.success('Login successful!');
      navigate(`/${result.role}`);
    } catch (error) {
      toast.error(error || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Info Section (Hidden on mobile) */}
          {!isMobile && (
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  color: 'white',
                  pr: 4,
                  animation: 'fadeInLeft 0.8s ease-out',
                  '@keyframes fadeInLeft': {
                    from: { opacity: 0, transform: 'translateX(-30px)' },
                    to: { opacity: 1, transform: 'translateX(0)' },
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LocalHospital sx={{ fontSize: 60, mr: 2 }} />
                  <Typography variant="h3" fontWeight="bold">
                    Virtual Medical Home
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.95 }}>
                  Your Health, Our Priority
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {[
                    'Connect with certified doctors',
                    'Book appointments instantly',
                    'Secure video consultations',
                    'Access medical records anytime',
                  ].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        animation: `fadeIn 0.8s ease-out ${0.2 + index * 0.1}s both`,
                        '@keyframes fadeIn': {
                          from: { opacity: 0, transform: 'translateY(10px)' },
                          to: { opacity: 1, transform: 'translateY(0)' },
                        },
                      }}
                    >
                      <CheckCircle sx={{ mr: 2, fontSize: 28 }} />
                      <Typography variant="h6">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={isMobile ? 12 : 6}>
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 4,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.95)',
                animation: 'fadeInRight 0.8s ease-out',
                '@keyframes fadeInRight': {
                  from: { opacity: 0, transform: 'translateX(30px)' },
                  to: { opacity: 1, transform: 'translateX(0)' },
                },
              }}
            >
              {/* Mobile Logo */}
              {isMobile && (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <LocalHospital sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    Virtual Medical Home
                  </Typography>
                </Box>
              )}

              <Typography
                component="h1"
                variant="h4"
                align="center"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome Back!
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Sign in to continue to your account
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 2, borderRadius: 2 }}
                  onClose={() => dispatch(clearError())}
                >
                  {error}
                </Alert>
              )}

              {/* Role Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 1.5, fontWeight: 500 }}
                >
                  Login as
                </Typography>
                <ToggleButtonGroup
                  value={formData.role}
                  exclusive
                  onChange={(e, newRole) => {
                    if (newRole !== null) {
                      setFormData({ ...formData, role: newRole });
                    }
                  }}
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      border: 2,
                      borderColor: 'divider',
                      '&.Mui-selected': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value="patient">
                    <Person sx={{ mr: 1 }} />
                    Patient
                  </ToggleButton>
                  <ToggleButton value="doctor">
                    <MedicalServices sx={{ mr: 1 }} />
                    Doctor
                  </ToggleButton>
                  <ToggleButton value="admin">
                    <AdminPanelSettings sx={{ mr: 1 }} />
                    Admin
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Sign In'
                  )}
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Forgot password?
                    </Typography>
                  </Link>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Don't have an account? Sign Up
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
