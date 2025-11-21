import { Container, Typography, Paper } from '@mui/material';

const PatientDetails = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Patient Details
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Patient details view component
        </Typography>
      </Paper>
    </Container>
  );
};

export default PatientDetails;
