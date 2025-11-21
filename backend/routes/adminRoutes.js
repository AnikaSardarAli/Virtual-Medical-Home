const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  getPendingDoctors,
  approveDoctor,
  getAnalytics,
  deleteUser,
  getSystemStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/doctors/pending', getPendingDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.get('/analytics', getAnalytics);
router.get('/stats', getSystemStats);

module.exports = router;
