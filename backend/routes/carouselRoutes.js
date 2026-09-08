const express = require('express');
const router = express.Router();
const { getCarousels, createCarousel, updateCarousel, deleteCarousel } = require('../controllers/carouselController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../config/cloudinary');

router.get('/', getCarousels);
router.post('/', protect, adminOnly, upload.single('banner'), createCarousel);
router.put('/:id', protect, adminOnly, upload.single('banner'), updateCarousel);
router.delete('/:id', protect, adminOnly, deleteCarousel);

module.exports = router;
