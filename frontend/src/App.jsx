import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';

// Patient Components
import PatientDashboard from './components/patient/Dashboard';
import DoctorList from './components/patient/DoctorList';
import BookAppointment from './components/patient/BookAppointment';
import PatientAppointments from './components/patient/Appointments';
import MedicalRecords from './components/patient/MedicalRecords';
import PatientProfile from './components/patient/Profile';
import Prescriptions from './components/patient/Prescriptions';

// Doctor Components
import DoctorDashboard from './components/doctor/Dashboard';
import DoctorAppointments from './components/doctor/Appointments';
import PatientDetails from './components/doctor/PatientDetails';
import CreatePrescription from './components/doctor/CreatePrescription';
import DoctorProfile from './components/doctor/Profile';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import DoctorApprovals from './components/admin/DoctorApprovals';
import Analytics from './components/admin/Analytics';

// Video Call
import VideoCall from './components/video/VideoCall';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="app">
        {isAuthenticated && <Header />}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to={`/${user?.role}`} />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to={`/${user?.role}`} />}
          />

          {/* Patient Routes */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/doctors"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DoctorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book-appointment/:doctorId"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/medical-records"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <MedicalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Prescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patient/:patientId"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <PatientDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescription/:appointmentId"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <CreatePrescription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctor-approvals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DoctorApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Video Call Route */}
          <Route
            path="/video-call/:appointmentId"
            element={
              <ProtectedRoute allowedRoles={['patient', 'doctor']}>
                <VideoCall />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={`/${user?.role}`} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
