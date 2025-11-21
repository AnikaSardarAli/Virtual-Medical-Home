const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let patientToken = '';
let doctorToken = '';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  const color = passed ? 'green' : 'red';
  log(`${icon} ${testName}`, color);
  if (details) {
    log(`   ${details}`, 'cyan');
  }
}

async function testEndpoint(name, fn) {
  try {
    await fn();
    return true;
  } catch (error) {
    logTest(name, false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test Suite
async function runTests() {
  let passedTests = 0;
  let failedTests = 0;

  log('\n' + '='.repeat(60), 'blue');
  log('🧪 BACKEND API TESTING SUITE', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  // 1. Health Check
  log('📡 SERVER HEALTH CHECK', 'yellow');
  const serverHealthy = await testEndpoint('Server is running', async () => {
    // Try a simple endpoint that doesn't require auth
    const response = await axios.get('http://localhost:5000');
    if (response.status === 200) {
      logTest('Server is running', true, 'Server responded successfully');
    }
  });
  serverHealthy ? passedTests++ : failedTests++;

  // 2. Authentication Tests
  log('\n🔐 AUTHENTICATION TESTS', 'yellow');
  
  // Login as Admin
  const adminLoginSuccess = await testEndpoint('Admin Login', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@vmh.com',
      password: 'test123',
    });
    adminToken = response.data.data.token;
    logTest('Admin Login', true, `Token: ${adminToken.substring(0, 20)}...`);
  });
  adminLoginSuccess ? passedTests++ : failedTests++;

  // Login as Patient
  const patientLoginSuccess = await testEndpoint('Patient Login', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'patient@test.com',
      password: 'test123',
    });
    patientToken = response.data.data.token;
    logTest('Patient Login', true, `Token: ${patientToken.substring(0, 20)}...`);
  });
  patientLoginSuccess ? passedTests++ : failedTests++;

  // Login as Doctor
  const doctorLoginSuccess = await testEndpoint('Doctor Login', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'doctor@test.com',
      password: 'test123',
    });
    doctorToken = response.data.data.token;
    logTest('Doctor Login', true, `Token: ${doctorToken.substring(0, 20)}...`);
  });
  doctorLoginSuccess ? passedTests++ : failedTests++;

  // 3. Admin Endpoints
  if (adminToken) {
    log('\n👑 ADMIN ENDPOINTS', 'yellow');

    const getAllUsersSuccess = await testEndpoint('Get All Users', async () => {
      const response = await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const userCount = response.data.users?.length || response.data.data?.users?.length || 0;
      logTest('Get All Users', true, `Found ${userCount} users`);
    });
    getAllUsersSuccess ? passedTests++ : failedTests++;

    const getPendingDoctorsSuccess = await testEndpoint('Get Pending Doctors', async () => {
      const response = await axios.get(`${BASE_URL}/admin/doctors/pending`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const doctorCount = response.data.doctors?.length || response.data.data?.length || 0;
      logTest('Get Pending Doctors', true, `Found ${doctorCount} pending doctors`);
    });
    getPendingDoctorsSuccess ? passedTests++ : failedTests++;

    const getAnalyticsSuccess = await testEndpoint('Get Analytics', async () => {
      const response = await axios.get(`${BASE_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const totalUsers = response.data.analytics?.users?.total || response.data.data?.totalUsers || 0;
      logTest('Get Analytics', true, `Total Users: ${totalUsers}`);
    });
    getAnalyticsSuccess ? passedTests++ : failedTests++;
  }

  // 4. Doctor Endpoints
  if (doctorToken) {
    log('\n👨‍⚕️ DOCTOR ENDPOINTS', 'yellow');

    const getAllDoctorsSuccess = await testEndpoint('Get All Doctors', async () => {
      const response = await axios.get(`${BASE_URL}/doctors`, {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      const doctorCount = response.data.doctors?.length || response.data.data?.length || 0;
      logTest('Get All Doctors', true, `Found ${doctorCount} doctors`);
    });
    getAllDoctorsSuccess ? passedTests++ : failedTests++;

    const getDoctorProfileSuccess = await testEndpoint('Get Doctor Profile', async () => {
      const response = await axios.get(`${BASE_URL}/doctors/profile`, {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      const doctorName = response.data.doctor?.userId?.firstName || response.data.data?.userId?.firstName || 'N/A';
      logTest('Get Doctor Profile', true, `Doctor: ${doctorName}`);
    });
    getDoctorProfileSuccess ? passedTests++ : failedTests++;
  }

  // 5. Patient Endpoints
  if (patientToken) {
    log('\n👤 PATIENT ENDPOINTS', 'yellow');

    let patientId = '';
    const getPatientProfileSuccess = await testEndpoint('Get Patient Profile', async () => {
      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${patientToken}` },
      });
      patientId = response.data.data?._id;
      logTest('Get Patient Profile', true, `Patient: ${response.data.data?.firstName || 'N/A'} (ID: ${patientId})`);
    });
    getPatientProfileSuccess ? passedTests++ : failedTests++;

    if (patientId) {
      const getAppointmentsSuccess = await testEndpoint('Get Patient Appointments', async () => {
        const response = await axios.get(`${BASE_URL}/appointments/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${patientToken}` },
        });
        logTest('Get Patient Appointments', true, `Found ${response.data.appointments?.length || 0} appointments`);
      });
      getAppointmentsSuccess ? passedTests++ : failedTests++;

      const getPrescriptionsSuccess = await testEndpoint('Get Patient Prescriptions', async () => {
        const response = await axios.get(`${BASE_URL}/prescriptions/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${patientToken}` },
        });
        logTest('Get Patient Prescriptions', true, `Found ${response.data.prescriptions?.length || 0} prescriptions`);
      });
      getPrescriptionsSuccess ? passedTests++ : failedTests++;
    } else {
      log('⚠️  Skipping appointment/prescription tests (no patient ID)', 'yellow');
      failedTests += 2;
    }
  }

  // 6. Database Check
  log('\n💾 DATABASE VALIDATION', 'yellow');
  const dbCheckSuccess = await testEndpoint('Database Connection', async () => {
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      params: { limit: 1 },
    });
    if (response.data) {
      logTest('Database Connection', true, 'Database is accessible');
    }
  });
  dbCheckSuccess ? passedTests++ : failedTests++;

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('📊 TEST RESULTS SUMMARY', 'blue');
  log('='.repeat(60), 'blue');
  log(`✅ Passed: ${passedTests}`, 'green');
  log(`❌ Failed: ${failedTests}`, 'red');
  log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`, 'cyan');
  log('='.repeat(60) + '\n', 'blue');

  if (failedTests === 0) {
    log('🎉 ALL TESTS PASSED! Backend is working perfectly!', 'green');
  } else {
    log('⚠️  Some tests failed. Please check the errors above.', 'yellow');
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests with error handling
runTests().catch(error => {
  log('\n❌ Test suite encountered an error:', 'red');
  console.error(error);
  process.exit(1);
});
