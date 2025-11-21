import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Link, 
  IconButton,
  Divider,
} from '@mui/material';
import {
  LocalHospital as LocalHospitalIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Paper
      component="footer"
      sx={{
        mt: 'auto',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        pt: 6,
        pb: 3,
      }}
      elevation={0}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalHospitalIcon sx={{ fontSize: 36, mr: 1 }} />
              <Typography variant="h5" fontWeight={800}>
                Virtual Medical Home
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Your trusted partner in healthcare. Providing quality medical services 
              with compassion and excellence since 2024.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.9,
                  '&:hover': { opacity: 1, pl: 0.5 },
                  transition: 'all 0.2s ease',
                }}
              >
                About Us
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.9,
                  '&:hover': { opacity: 1, pl: 0.5 },
                  transition: 'all 0.2s ease',
                }}
              >
                Services
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.9,
                  '&:hover': { opacity: 1, pl: 0.5 },
                  transition: 'all 0.2s ease',
                }}
              >
                Doctors
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.9,
                  '&:hover': { opacity: 1, pl: 0.5 },
                  transition: 'all 0.2s ease',
                }}
              >
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.9,
                  '&:hover': { opacity: 1, pl: 0.5 },
                  transition: 'all 0.2s ease',
                }}
              >
                Online Consultation
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.9,
                  '&:hover': { opacity: 1, pl: 0.5 },
                  transition: 'all 0.2s ease',
                }}
              >
                Appointment Booking
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.9,
                  '&:hover': { opacity: 1, pl: 0.5 },
                  transition: 'all 0.2s ease',
                }}
              >
                Medical Records
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.9,
                  '&:hover': { opacity: 1, pl: 0.5 },
                  transition: 'all 0.2s ease',
                }}
              >
                Prescriptions
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  support@vmh.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  123 Healthcare Ave,<br />
                  Medical District, MD 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 3 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © 2025 Virtual Medical Home. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;
