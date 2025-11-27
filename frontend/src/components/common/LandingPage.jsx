import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  MedicalServices,
  LocalHospital,
  VideoCall,
  Schedule,
  Security,
  Speed,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalHospital sx={{ fontSize: 50 }} />,
      title: 'Expert Doctors',
      description: 'Connect with qualified and experienced healthcare professionals',
    },
    {
      icon: <VideoCall sx={{ fontSize: 50 }} />,
      title: 'Video Consultations',
      description: 'Get medical advice from the comfort of your home',
    },
    {
      icon: <Schedule sx={{ fontSize: 50 }} />,
      title: 'Easy Scheduling',
      description: 'Book appointments instantly with your preferred doctors',
    },
    {
      icon: <Security sx={{ fontSize: 50 }} />,
      title: 'Secure Records',
      description: 'Your medical records are safe and accessible anytime',
    },
    {
      icon: <Speed sx={{ fontSize: 50 }} />,
      title: 'Quick Response',
      description: 'Get timely medical assistance when you need it',
    },
    {
      icon: <MedicalServices sx={{ fontSize: 50 }} />,
      title: 'Complete Care',
      description: 'Comprehensive healthcare services in one platform',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <MedicalServices sx={{ fontSize: 70, mr: 2 }} />
                  <Typography variant="h2" fontWeight="bold">
                    Virtual Medical Home
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 300 }}>
                  Your Healthcare, Anywhere, Anytime
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Experience modern healthcare with video consultations, instant appointments,
                  and secure medical records - all in one platform.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      background: 'white',
                      color: '#667eea',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: '#f5f5f5',
                        transform: 'translateY(-2px)',
                        boxShadow: 6,
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      borderColor: 'white',
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  textAlign: 'center',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                  },
                }}
              >
                <MedicalServices sx={{ fontSize: 300, color: 'rgba(255, 255, 255, 0.2)' }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Why Choose Us?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Everything you need for complete healthcare management
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ py: 4 }}>
                    <Box sx={{ color: '#667eea', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of patients and doctors using Virtual Medical Home
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                background: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                '&:hover': {
                  background: '#f5f5f5',
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
                transition: 'all 0.3s',
              }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#333', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2025 Virtual Medical Home. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
