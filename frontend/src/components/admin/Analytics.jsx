import { Container, Typography, Paper } from '@mui/material';

const Analytics = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Platform analytics component
        </Typography>
      </Paper>
    </Container>
  );
};

export default Analytics;
