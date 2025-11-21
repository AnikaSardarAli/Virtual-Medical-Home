import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  School as EducationIcon,
  Work as ExperienceIcon,
  Badge as LicenseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as DocumentIcon,
  Refresh as RefreshIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import axios from '../../services/api';
import toast from 'react-hot-toast';

const DoctorApprovals = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveDialog, setApproveDialog] = useState({ open: false, doctor: null });
  const [rejectDialog, setRejectDialog] = useState({ open: false, doctor: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/doctors/pending');
      console.log('Pending doctors response:', response.data);
      setPendingDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load pending doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setProcessing(true);
      await axios.put(`/admin/doctors/${approveDialog.doctor._id}/approve`, {
        isApproved: true,
      });
      toast.success('Doctor approved successfully! 🎉');
      setApproveDialog({ open: false, doctor: null });
      fetchPendingDoctors();
    } catch (error) {
      console.error('Error approving doctor:', error);
      toast.error('Failed to approve doctor');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      await axios.put(`/admin/doctors/${rejectDialog.doctor._id}/approve`, {
        isApproved: false,
        rejectionReason,
      });
      toast.success('Doctor application rejected');
      setRejectDialog({ open: false, doctor: null });
      setRejectionReason('');
      fetchPendingDoctors();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      toast.error('Failed to reject doctor');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Doctor Approvals 👨‍⚕️
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Review and approve doctor applications
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchPendingDoctors}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '2px solid',
              borderColor: 'warning.main',
              borderRadius: 2,
              bgcolor: 'warning.50',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <PendingIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pending Applications
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="warning.main">
                  {pendingDoctors.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : pendingDoctors.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'grey.200',
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'success.main',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckCircle sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            All Caught Up! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No pending doctor applications at the moment
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pendingDoctors.map((doctor) => {
            // Handle populated userId data
            const userData = doctor.userId || doctor;
            const firstName = userData.firstName || doctor.firstName;
            const lastName = userData.lastName || doctor.lastName;
            const email = userData.email || doctor.email;
            const phone = userData.phone || doctor.phone;
            const profilePicture = userData.profilePicture || doctor.profilePicture;

            return (
            <Grid item xs={12} lg={6} key={doctor._id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'grey.200',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Doctor Header */}
                                    {/* Doctor Header */}
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 3 }}>
                    <Avatar
                      src={doctor.userId?.profilePicture || doctor.profilePicture}
                      sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
                    >
                      {(doctor.userId?.firstName || doctor.firstName)?.[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" fontWeight="bold">
                        Dr. {doctor.userId?.firstName || doctor.firstName}{' '}
                        {doctor.userId?.lastName || doctor.lastName}
                      </Typography>
                      <Chip
                        label={doctor.specialization}
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Chip
                      icon={<PendingIcon />}
                      label="Pending"
                      color="warning"
                      variant="outlined"
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Contact Information */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Contact Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {doctor.userId?.email || doctor.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {doctor.userId?.phone || doctor.phone || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Professional Details */}
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <EducationIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Qualifications"
                        secondary={
                          doctor.qualifications && doctor.qualifications.length > 0
                            ? doctor.qualifications.join(', ')
                            : doctor.qualification || 'Not specified'
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ExperienceIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Experience"
                        secondary={`${doctor.experience || 0} years`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LicenseIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="License Number"
                        secondary={doctor.licenseNumber || 'Not provided'}
                      />
                    </ListItem>
                  </List>

                  {doctor.documents && doctor.documents.length > 0 && (
                    <>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Uploaded Documents
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {doctor.documents.map((doc, index) => (
                            <Chip
                              key={index}
                              icon={<DocumentIcon />}
                              label={`Document ${index + 1}`}
                              size="small"
                              variant="outlined"
                              onClick={() => window.open(doc, '_blank')}
                              sx={{ cursor: 'pointer' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </>
                  )}

                  {doctor.bio && (
                    <>
                      <Divider sx={{ mb: 2 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Bio
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.bio}
                        </Typography>
                      </Box>
                    </>
                  )}

                  <Divider sx={{ mt: 2, mb: 2 }} />

                  {/* Registration Date */}
                  <Typography variant="caption" color="text.secondary">
                    Applied on: {new Date(doctor.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<ApproveIcon />}
                    onClick={() => setApproveDialog({ open: true, doctor })}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Approve
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<RejectIcon />}
                    onClick={() => setRejectDialog({ open: true, doctor })}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Reject
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      )}

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveDialog.open}
        onClose={() => !processing && setApproveDialog({ open: false, doctor: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Doctor</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve{' '}
            <strong>
              Dr. {approveDialog.doctor?.userId?.firstName || approveDialog.doctor?.firstName}{' '}
              {approveDialog.doctor?.userId?.lastName || approveDialog.doctor?.lastName}
            </strong>
            ? They will be able to accept appointments immediately.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setApproveDialog({ open: false, doctor: null })}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            color="success"
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <ApproveIcon />}
          >
            {processing ? 'Approving...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={() => !processing && setRejectDialog({ open: false, doctor: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Doctor Application</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You are about to reject the application of{' '}
            <strong>
              Dr. {rejectDialog.doctor?.userId?.firstName || rejectDialog.doctor?.firstName}{' '}
              {rejectDialog.doctor?.userId?.lastName || rejectDialog.doctor?.lastName}
            </strong>
            . Please provide a reason:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRejectDialog({ open: false, doctor: null });
              setRejectionReason('');
            }}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <RejectIcon />}
          >
            {processing ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorApprovals;
