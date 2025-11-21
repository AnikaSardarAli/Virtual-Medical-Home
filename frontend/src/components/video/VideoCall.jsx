import { Container, Typography, Paper } from '@mui/material';

const VideoCall = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Video Consultation
      </Typography>
      <Paper sx={{ p: 3, height: '70vh' }}>
        <Typography variant="body1">
          Video call component - WebRTC integration
        </Typography>
      </Paper>
    </Container>
  );
};

export default VideoCall;
