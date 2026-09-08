const cron = require('node-cron');
const Attendance = require('../models/Attendance');

const cleanupOldAttendance = async () => {
  try {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const result = await Attendance.deleteMany({
      createdAt: { $lt: twoWeeksAgo }
    });
    if (result.deletedCount > 0) {
      console.log(`[Auto Cleanup] Successfully deleted ${result.deletedCount} attendance records older than 14 days (2 weeks).`);
    }
  } catch (error) {
    console.error('[Auto Cleanup Error]:', error.message);
  }
};

const initCron = () => {
  // Run daily at midnight 00:00
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Running daily attendance cleanup check...');
    await cleanupOldAttendance();
  });

  // Run immediately on server start to clean any leftover old records
  cleanupOldAttendance();
};

module.exports = { initCron, cleanupOldAttendance };
