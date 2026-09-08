const mongoose = require('mongoose');

const kpiConfigSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Bảng Lương KPI Chuẩn'
  },
  odyleRate: {
    type: Number,
    required: true,
    default: 2 // 2 Odyle = 1 giờ làm
  },
  abyssRate: {
    type: Number,
    required: true,
    default: 10 // 10 điểm Abyss = 1 giờ làm
  },
  bossHourRate: {
    type: Number,
    required: true,
    default: 1.5 // 1 giờ Boss = 1.5 giờ làm
  },
  baseHourlySalary: {
    type: Number,
    required: true,
    default: 60000 // 60.000 VNĐ / giờ
  },
  note: {
    type: String,
    default: 'Cách tính: Tổng Giờ = (Số Odyle / OdyleRate) + (Điểm Abyss / AbyssRate) + (Số giờ Boss * BossRate). Tổng Lương = Tổng Giờ * Lương/giờ.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('KPIConfig', kpiConfigSchema);
