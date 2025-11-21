import { Container, Typography, Paper } from '@mui/material';

const CreatePrescription = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Prescription
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Prescription creation form component
        </Typography>
      </Paper>
    </Container>
  );
};

export default CreatePrescription;
