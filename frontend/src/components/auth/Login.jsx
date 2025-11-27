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
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  IconButton,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AdminPanelSettings,
  LocalHospital,
  Person,
  MedicalServices,
} from '@mui/icons-material';
import { login, clearError } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [selectedRole, setSelectedRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const roleConfig = {
    admin: {
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      label: 'Admin',
      description: 'System Management'
    },
    doctor: {
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      gradient: 'linear-gradient(135deg, #667eea 0%, #2196f3 100%)',
      label: 'Doctor',
      description: 'Healthcare Provider'
    },
    patient: {
      icon: <Person sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      label: 'Patient',
      description: 'Healthcare Seeker'
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setSelectedRole(newRole);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(login(formData)).unwrap();
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <MedicalServices sx={{ fontSize: 60, mr: 2 }} />
                <Typography variant="h3" fontWeight="bold">
                  Virtual Medical Home
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                Your Healthcare, Anywhere, Anytime
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.8 }}>
                ✓ Connect with qualified doctors
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.8 }}>
                ✓ Book appointments instantly
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.8 }}>
                ✓ Secure medical records
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                ✓ Video consultations
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={24}
              sx={{
                padding: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    background: roleConfig[selectedRole].gradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to continue to your account
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
                  {error}
                </Alert>
              )}

              {/* Role Selection Cards */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                Select Your Role
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {Object.entries(roleConfig).map(([role, config]) => (
                  <Grid item xs={4} key={role}>
                    <Card
                      onClick={() => setSelectedRole(role)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: selectedRole === role ? `3px solid ${config.color}` : '2px solid #e0e0e0',
                        background: selectedRole === role ? config.gradient : 'white',
                        color: selectedRole === role ? 'white' : 'text.primary',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2, px: 1 }}>
                        {config.icon}
                        <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                          {config.label}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {config.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ mb: 3 }} />

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: roleConfig[selectedRole].color,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: roleConfig[selectedRole].color,
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
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: roleConfig[selectedRole].color,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: roleConfig[selectedRole].color,
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
                    background: roleConfig[selectedRole].gradient,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    '&:hover': {
                      opacity: 0.9,
                      transform: 'translateY(-2px)',
                      boxShadow: 6,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    `Sign In as ${roleConfig[selectedRole].label}`
                  )}
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                      Forgot password?
                    </Typography>
                  </Link>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                      Don't have an account? Sign Up
                    </Typography>
                  </Link>
                </Box>
              </Box>

              {/* Demo Credentials */}
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" sx={{ mb: 1 }}>
                  Demo Credentials:
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Admin: admin@vmc.com | admin123
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Doctor: doctor@vmc.com | doctor123
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Patient: patient@vmc.com | patient123
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
