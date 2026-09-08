const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { initCron } = require('./cron/cleanupCron');

// Models for initial seeding
const User = require('./models/User');
const KPIConfig = require('./models/KPIConfig');
const Carousel = require('./models/Carousel');
const Post = require('./models/Post');

const app = express();

// Connect Database
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/kpi', require('./routes/kpiRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/carousel', require('./routes/carouselRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Employee Attendance System API Server Running' });
});

// Initial Database Seeder for seamless immediate demo
const seedDatabase = async () => {
  try {
    // 1. Seed Admin & Employee users if empty
    const userCount = await User.countDocuments();
    let adminUser;
    if (userCount === 0) {
      adminUser = await User.create({
        fullName: 'Quản Trị Viên (Admin)',
        email: 'admin@manageapp.com',
        password: 'adminpassword123',
        role: 'admin',
        age: 30,
        phone: '0988776655',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });

      await User.create({
        fullName: 'Nguyễn Văn Nhân Viên',
        email: 'employee@manageapp.com',
        password: 'employeepassword123',
        role: 'employee',
        age: 24,
        phone: '0912345678',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      });

      console.log('[Seeder] Default Admin (admin@manageapp.com / adminpassword123) and Employee created.');
    } else {
      adminUser = await User.findOne({ role: 'admin' });
    }

    // 2. Seed default KPI Config if empty
    const kpiCount = await KPIConfig.countDocuments();
    if (kpiCount === 0) {
      await KPIConfig.create({
        title: 'Bảng Barem KPI & Lương Thưởng 2026',
        odyleRate: 0.5,
        abyssRate: 0.1,
        bossHourRate: 1.5,
        baseHourlySalary: 60000,
        note: 'Cách tính: Tổng Giờ = (Số Odyle * 0.5) + (Điểm Abyss * 0.1) + (Số giờ Boss * 1.5). Tổng Lương = Tổng Giờ * 60,000đ.'
      });
      console.log('[Seeder] Default KPI Formula initialized.');
    }

    // 3. Seed default Carousel items if empty
    const carouselCount = await Carousel.countDocuments();
    if (carouselCount === 0) {
      await Carousel.create([
        {
          title: 'Hệ Thống Chấm Công KPI Hiện Đại 2026',
          description: 'Nhập số lượng Odyle, điểm Abyss & giờ Boss để tính lương tự động và chuẩn xác.',
          imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200',
          order: 1,
          isActive: true
        },
        {
          title: 'Sự Kiện Săn Boss & Tăng Điểm Abyss Tuần Này',
          description: 'Hoàn thành mốc KPI tuần để nhận x1.5 tổng số giờ làm việc!',
          imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200',
          order: 2,
          isActive: true
        },
        {
          title: 'Góc Giải Trí Nhân Viên: Minigame Baccarat 15s',
          description: 'Trải nghiệm Baccarat chọn Cái/Con miễn phí, nhận thưởng tinh thần mỗi ngày.',
          imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200',
          order: 3,
          isActive: true
        }
      ]);
      console.log('[Seeder] Default Carousel Slides initialized.');
    }

    // 4. Seed default Posts (News/Rules/FAQ) if empty
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      await Post.create([
        {
          title: 'Thông Báo Quy Trình Chấm Công & Tải Ảnh Minh Chứng',
          content: 'Khi thực hiện chấm công, nhân viên cần tải ảnh chụp màn hình chứa số Odyle, điểm Abyss và số giờ Boss để Admin kiểm tra và duyệt bảng lương.',
          category: 'news',
          isPinned: true,
          author: adminUser ? adminUser._id : undefined
        },
        {
          title: 'Nội Quy Thời Gian Lưu Trữ Phiếu Chấm Công (2 Tuần)',
          content: 'Hệ thống tự động dọn dẹp và làm sạch lịch sử chấm công sau 2 tuần (14 ngày). Nhân viên lưu ý chụp lại đối soát khi cần thiết.',
          category: 'rule',
          isPinned: true,
          author: adminUser ? adminUser._id : undefined
        },
        {
          title: 'Làm thế nào để hệ thống tính lương tự động?',
          content: 'Sau khi nhập số Odyle, Abyss và giờ Boss, hệ thống áp dụng công thức KPI đã thiết lập để cho ra ngay kết quả tổng số giờ làm và số tiền tương ứng.',
          category: 'faq',
          isPinned: false,
          author: adminUser ? adminUser._id : undefined
        }
      ]);
      console.log('[Seeder] Default News & Rules initialized.');
    }
  } catch (err) {
    console.error('[Seeder Error]:', err.message);
  }
};

seedDatabase();

// Initialize cron task for auto deletion of 2-week old records
initCron();

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
