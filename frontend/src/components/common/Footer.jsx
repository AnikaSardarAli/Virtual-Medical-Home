import { Box, Typography, Container, Paper } from '@mui/material';

const Footer = () => {
  return (
    <Paper
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
      elevation={0}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 Virtual Medical Home. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your Health, Our Priority
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;
