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
  Medication as MedicationIcon,
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
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
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
    handleCloseUserMenu();
  };

  const getNavLinksWithIcons = () => {
    if (user?.role === 'patient') {
      return [
        { label: 'Dashboard', path: '/patient', icon: <DashboardIcon /> },
        { label: 'Find Doctors', path: '/patient/doctors', icon: <MedicalServicesIcon /> },
        { label: 'Appointments', path: '/patient/appointments', icon: <EventIcon /> },
        { label: 'Medical Records', path: '/patient/medical-records', icon: <FolderIcon /> },
        { label: 'Prescriptions', path: '/patient/prescriptions', icon: <MedicationIcon /> },
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

  const handleNavigation = (path) => {
    navigate(path);
    setMobileDrawer(false);
  };

  return (
    <>
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
              {/* Mobile Menu Icon */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  onClick={toggleMobileDrawer}
                  color="inherit"
                  sx={{
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Logo - Desktop */}
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
                  }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    color: 'white',
                    letterSpacing: '0.5px',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  Virtual Medical Home
                </Typography>
              </Box>

              {/* Logo - Mobile */}
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  alignItems: 'center',
                  flexGrow: 1,
                }}
              >
                <LocalHospitalIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: 'white',
                  }}
                >
                  VMH
                </Typography>
              </Box>

              {/* Desktop Navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4, gap: 1 }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    startIcon={link.icon}
                    sx={{
                      color: 'white',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: isActivePath(link.path) ? 700 : 500,
                      background: isActivePath(link.path) 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'transparent',
                      backdropFilter: isActivePath(link.path) ? 'blur(10px)' : 'none',
                      border: isActivePath(link.path) 
                        ? '1px solid rgba(255, 255, 255, 0.3)' 
                        : 'none',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>

              {/* User Menu */}
              <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton
                    size="large"
                    color="inherit"
                    sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User Avatar */}
                <Tooltip title="Account">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      p: 0.5,
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={handleOpenUserMenu}
                  >
                    <Avatar
                      alt={user?.firstName}
                      src={user?.profilePicture}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: getRoleColor(user?.role),
                        fontWeight: 700,
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      {getInitials(user?.firstName, user?.lastName)}
                    </Avatar>
                    {!isMobile && (
                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="body2" fontWeight={600}>
                          {user?.firstName} {user?.lastName}
                        </Typography>
                        <Chip
                          label={user?.role}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.7rem',
                            bgcolor: getRoleColor(user?.role),
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Tooltip>

                {/* User Menu Dropdown */}
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    elevation: 8,
                    sx: {
                      minWidth: 200,
                      borderRadius: 2,
                      mt: 1,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      navigate(`/${user?.role}/profile`);
                      handleCloseUserMenu();
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawer}
        onClose={toggleMobileDrawer}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospitalIcon sx={{ mr: 1, fontSize: 32 }} />
              <Typography variant="h6" fontWeight={700}>
                VMH
              </Typography>
            </Box>
            <IconButton onClick={toggleMobileDrawer} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />

          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                selected={isActivePath(link.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: isActivePath(link.path) ? 700 : 500,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
