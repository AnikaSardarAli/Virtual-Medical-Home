import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const MedicalRecords = () => {
  const { user } = useSelector((state) => state.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: '',
    description: '',
    recordType: 'Lab Report',
  });

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/medical-records/patient/${user._id}`);
      if (response.data.success) {
        setRecords(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    try {
      const response = await api.post('/medical-records/upload', {
        patientId: user._id,
        ...newRecord,
        fileUrl: 'https://example.com/sample-document.pdf', // In real app, handle file upload
      });
      
      if (response.data.success) {
        toast.success('Medical record added successfully');
        setOpenDialog(false);
        setNewRecord({ title: '', description: '', recordType: 'Lab Report' });
        fetchMedicalRecords();
      }
    } catch (error) {
      console.error('Error adding record:', error);
      toast.error('Failed to add medical record');
    }
  };

  const getRecordTypeColor = (type) => {
    const colors = {
      'lab_report': 'primary',
      'prescription': 'success',
      'scan': 'info',
      'xray': 'warning',
      'other': 'default',
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Medical Records
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Record
        </Button>
      </Box>

      {records.length === 0 ? (
        <Alert severity="info">
          No medical records found. Click "Add Record" to upload your first record.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {records.map((record) => (
            <Grid item xs={12} md={6} key={record._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {record.fileName}
                    </Typography>
                    <Chip
                      label={record.documentType}
                      color={getRecordTypeColor(record.documentType)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {record.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {record.uploadedBy && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Uploaded by {record.uploadedBy.firstName} {record.uploadedBy.lastName}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => window.open(record.fileUrl, '_blank')}
                  >
                    Download
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DescriptionIcon />}
                    onClick={() => window.open(record.fileUrl, '_blank')}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Record Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Medical Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newRecord.title}
            onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newRecord.description}
            onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Record Type"
            fullWidth
            variant="outlined"
            select
            SelectProps={{ native: true }}
            value={newRecord.recordType}
            onChange={(e) => setNewRecord({ ...newRecord, recordType: e.target.value })}
          >
            <option value="Lab Report">Lab Report</option>
            <option value="Prescription">Prescription</option>
            <option value="Imaging">Imaging</option>
            <option value="Discharge Summary">Discharge Summary</option>
            <option value="Other">Other</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRecord} variant="contained" disabled={!newRecord.title}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalRecords;
