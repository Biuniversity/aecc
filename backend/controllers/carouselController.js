const Carousel = require('../models/Carousel');

exports.getCarousels = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    let query = {};
    if (activeOnly === 'true') {
      query.isActive = true;
    }
    const slides = await Carousel.find(query).sort({ order: 1, createdAt: -1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách Carousel', error: error.message });
  }
};

exports.createCarousel = async (req, res) => {
  try {
    const { title, description, linkUrl, order, isActive, imageUrl } = req.body;
    let finalImageUrl = imageUrl;

    if (req.file) {
      finalImageUrl = req.file.path || `/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ message: 'Vui lòng cung cấp hình ảnh banner Carousel' });
    }

    const slide = await Carousel.create({
      title: title || 'Banner Quảng Cáo',
      description: description || '',
      imageUrl: finalImageUrl,
      linkUrl: linkUrl || '#',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ message: 'Thêm banner Carousel mới thành công', slide });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo Carousel', error: error.message });
  }
};

exports.updateCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, linkUrl, order, isActive, imageUrl } = req.body;

    const slide = await Carousel.findById(id);
    if (!slide) {
      return res.status(404).json({ message: 'Không tìm thấy banner Carousel' });
    }

    if (title) slide.title = title;
    if (description !== undefined) slide.description = description;
    if (linkUrl) slide.linkUrl = linkUrl;
    if (order !== undefined) slide.order = Number(order);
    if (isActive !== undefined) slide.isActive = isActive;
    if (imageUrl) slide.imageUrl = imageUrl;
    if (req.file) {
      slide.imageUrl = req.file.path || `/uploads/${req.file.filename}`;
    }

    await slide.save();
    res.json({ message: 'Cập nhật Carousel thành công', slide });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật Carousel', error: error.message });
  }
};

exports.deleteCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await Carousel.findByIdAndDelete(id);
    if (!slide) {
      return res.status(404).json({ message: 'Không tìm thấy banner Carousel để xóa' });
    }
    res.json({ message: 'Xóa banner Carousel thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa Carousel', error: error.message });
  }
};
