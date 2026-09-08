const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Quyền truy cập bị từ chối. Chỉ dành cho Quản trị viên (Admin)' });
  }
};

module.exports = { adminOnly };
