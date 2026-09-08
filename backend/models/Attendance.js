const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  odyleCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  abyssPoints: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  bossHours: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  proofImage: {
    type: String,
    required: true
  },
  calculatedHours: {
    type: Number,
    required: true,
    default: 0
  },
  calculatedSalary: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
