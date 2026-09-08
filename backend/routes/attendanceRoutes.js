const express = require('express');
const router = express.Router();
const { 
  submitAttendance, 
  previewCalculation, 
  getMyAttendance, 
  getAllAttendance, 
  updateAttendance, 
  deleteAttendance 
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../config/cloudinary');

router.use(protect);

router.post('/preview', previewCalculation);
router.post('/submit', upload.single('proofImage'), submitAttendance);
router.get('/my', getMyAttendance);

// Admin routes
router.get('/all', adminOnly, getAllAttendance);
router.put('/:id', adminOnly, upload.single('proofImage'), updateAttendance);
router.delete('/:id', adminOnly, deleteAttendance);

module.exports = router;
