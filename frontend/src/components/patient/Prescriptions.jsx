import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LocalHospital as DoctorIcon,
  Medication as MedicationIcon,
  CalendarToday as DateIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import axios from '../../services/api';
import toast from 'react-hot-toast';

const Prescriptions = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/prescriptions/patient/${user._id}`);
      setPrescriptions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setViewDialog(true);
  };

  const handleCloseDialog = () => {
    setViewDialog(false);
    setSelectedPrescription(null);
  };

  const handleDownload = (prescription) => {
    // Create a simple text version for download
    const content = `
PRESCRIPTION

Patient: ${prescription.patientId?.firstName} ${prescription.patientId?.lastName}
Doctor: Dr. ${prescription.doctorId?.userId?.firstName} ${prescription.doctorId?.userId?.lastName}
Specialization: ${prescription.doctorId?.specialization}
Date: ${new Date(prescription.createdAt).toLocaleDateString()}

DIAGNOSIS:
${prescription.diagnosis}

MEDICATIONS:
${prescription.medications.map((med, index) => `
${index + 1}. ${med.name}
   - Dosage: ${med.dosage}
   - Frequency: ${med.frequency}
   - Duration: ${med.duration}
`).join('\n')}

${prescription.notes ? `NOTES:\n${prescription.notes}` : ''}

Generated: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription-${new Date(prescription.createdAt).toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Prescription downloaded successfully!');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          My Prescriptions 💊
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          View and download your medical prescriptions
        </Typography>
      </Box>

      {/* Stats Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'primary.main',
          bgcolor: 'primary.50',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MedicationIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Prescriptions
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              {prescriptions.length}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Prescriptions List */}
      {prescriptions.length === 0 ? (
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
          <MedicationIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            No Prescriptions Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your prescriptions will appear here after your doctor appointments
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {prescriptions.map((prescription) => (
            <Grid item xs={12} key={prescription._id}>
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
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <MedicationIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Prescription from Dr. {prescription.doctorId?.userId?.firstName}{' '}
                          {prescription.doctorId?.userId?.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {prescription.doctorId?.specialization}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={<DateIcon />}
                      label={new Date(prescription.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Diagnosis */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Diagnosis
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {prescription.diagnosis}
                    </Typography>
                  </Box>

                  {/* Medications Summary */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Medications ({prescription.medications?.length || 0})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {prescription.medications?.slice(0, 3).map((med, index) => (
                        <Chip
                          key={index}
                          label={med.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                      {prescription.medications?.length > 3 && (
                        <Chip
                          label={`+${prescription.medications.length - 3} more`}
                          size="small"
                          color="default"
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Notes */}
                  {prescription.notes && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Notes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {prescription.notes.length > 100
                          ? `${prescription.notes.substring(0, 100)}...`
                          : prescription.notes}
                      </Typography>
                    </Box>
                  )}

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewDetails(prescription)}
                      fullWidth
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(prescription)}
                      fullWidth
                    >
                      Download
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* View Details Dialog */}
      <Dialog
        open={viewDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MedicationIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Prescription Details
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box sx={{ pt: 2 }}>
              {/* Doctor Info */}
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Prescribed by
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  Dr. {selectedPrescription.doctorId?.userId?.firstName}{' '}
                  {selectedPrescription.doctorId?.userId?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPrescription.doctorId?.specialization}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Date: {new Date(selectedPrescription.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Paper>

              {/* Diagnosis */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Diagnosis
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.main' }}>
                  <Typography variant="body1">{selectedPrescription.diagnosis}</Typography>
                </Paper>
              </Box>

              {/* Medications Table */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Medications
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.300' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell><strong>Medicine</strong></TableCell>
                        <TableCell><strong>Dosage</strong></TableCell>
                        <TableCell><strong>Frequency</strong></TableCell>
                        <TableCell><strong>Duration</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPrescription.medications?.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>{med.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Notes */}
              {selectedPrescription.notes && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Additional Notes
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.main' }}>
                    <Typography variant="body2">{selectedPrescription.notes}</Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              handleDownload(selectedPrescription);
              handleCloseDialog();
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Prescriptions;
