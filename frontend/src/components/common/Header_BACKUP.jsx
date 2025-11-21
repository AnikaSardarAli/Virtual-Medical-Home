import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Divider,
  useScrollTrigger,
  Slide,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LocalHospital as LocalHospitalIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  ExitToApp,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  MedicalServices as MedicalServicesIcon,
  Folder as FolderIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { logout } from '../../redux/slices/authSlice';
import { getInitials } from '../../utils/helpers';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawer(!mobileDrawer);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavLinksWithIcons = () => {
    if (user?.role === 'patient') {
      return [
        { label: 'Dashboard', path: '/patient', icon: <DashboardIcon /> },
        { label: 'Find Doctors', path: '/patient/doctors', icon: <MedicalServicesIcon /> },
        { label: 'Appointments', path: '/patient/appointments', icon: <EventIcon /> },
        { label: 'Medical Records', path: '/patient/medical-records', icon: <FolderIcon /> },
      ];
    } else if (user?.role === 'doctor') {
      return [
        { label: 'Dashboard', path: '/doctor', icon: <DashboardIcon /> },
        { label: 'Appointments', path: '/doctor/appointments', icon: <EventIcon /> },
        { label: 'Profile', path: '/doctor/profile', icon: <AccountCircle /> },
      ];
    } else if (user?.role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
        { label: 'Users', path: '/admin/users', icon: <PeopleIcon /> },
        { label: 'Doctor Approvals', path: '/admin/doctor-approvals', icon: <MedicalServicesIcon /> },
        { label: 'Analytics', path: '/admin/analytics', icon: <AnalyticsIcon /> },
      ];
    }
    return [];
  };

  const navLinks = getNavLinksWithIcons();
  const isActivePath = (path) => location.pathname === path;

  const getRoleColor = (role) => {
    switch(role) {
      case 'patient': return '#4CAF50';
      case 'doctor': return '#2196F3';
      case 'admin': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            {/* Desktop Logo */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => navigate('/')}
            >
              <LocalHospitalIcon
                sx={{
                  mr: 1,
                  fontSize: 36,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                  },
                }}
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  background: 'linear-gradient(to right, #fff, #f0f0f0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                VMH
              </Typography>
            </Box>

            {/* Mobile Menu Icon */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={toggleMobileDrawer}
                color="inherit"
                sx={{
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'rotate(90deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
