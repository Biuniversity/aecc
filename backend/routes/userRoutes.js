const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../config/cloudinary');

router.use(protect, adminOnly);

router.get('/', getAllUsers);
router.put('/:id', upload.single('avatar'), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
