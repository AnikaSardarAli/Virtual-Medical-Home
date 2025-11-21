import { Container, Typography, Paper } from '@mui/material';

const DoctorApprovals = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Doctor Approvals
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Doctor approval management component
        </Typography>
      </Paper>
    </Container>
  );
};

export default DoctorApprovals;
