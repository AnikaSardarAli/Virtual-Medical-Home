import { Container, Typography, Paper } from '@mui/material';

const UserManagement = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          User management component
        </Typography>
      </Paper>
    </Container>
  );
};

export default UserManagement;
