import { Container, Typography, Paper } from '@mui/material';

const BookAppointment = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Book Appointment
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Appointment booking form component
        </Typography>
      </Paper>
    </Container>
  );
};

export default BookAppointment;
