const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secure_jwt_secret_key_manageapp_2026_!@#$', {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, age, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email này đã được sử dụng' });
    }

    const avatarUrl = req.file ? (req.file.path || `/uploads/${req.file.filename}`) : undefined;

    const user = await User.create({
      fullName,
      email,
      password,
      rawPassword: password,
      age: age || 22,
      phone: phone || '',
      role: role && ['admin', 'employee'].includes(role) ? role : 'employee',
      ...(avatarUrl && { avatarUrl })
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      age: user.age,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi đăng ký', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      age: user.age,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tải thông tin tài khoản', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, age, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Password change logic
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu cũ để xác thực đổi mật khẩu' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
      }
      user.password = newPassword;
      user.rawPassword = newPassword;
    }

    if (fullName) user.fullName = fullName;
    if (age) user.age = Number(age);
    if (phone !== undefined) user.phone = phone;

    if (req.file) {
      user.avatarUrl = req.file.path || `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      age: user.age,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      rawPassword: user.rawPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật hồ sơ cá nhân', error: error.message });
  }
};
