const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tải danh sách nhân viên', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, age, phone, email, role, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }

    if (fullName) user.fullName = fullName;
    if (age) user.age = age;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (role && ['admin', 'employee'].includes(role)) user.role = role;
    if (password) {
      user.password = password;
      user.rawPassword = password;
    }
    if (req.file) {
      user.avatarUrl = req.file.path || `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: 'Cập nhật thông tin nhân viên thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật tài khoản', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Bạn không thể tự xóa tài khoản của chính mình' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản để xóa' });
    }
    res.json({ message: 'Xóa tài khoản nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa tài khoản', error: error.message });
  }
};
