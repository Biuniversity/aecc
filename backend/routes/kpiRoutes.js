const express = require('express');
const router = express.Router();
const { getKPIConfig, updateKPIConfig } = require('../controllers/kpiController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getKPIConfig);
router.put('/', protect, adminOnly, updateKPIConfig);

module.exports = router;
