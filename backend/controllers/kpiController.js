const KPIConfig = require('../models/KPIConfig');

// Get active KPI configuration or create default if none exists
exports.getKPIConfig = async (req, res) => {
  try {
    let config = await KPIConfig.findOne().sort({ updatedAt: -1 });
    if (!config) {
      config = await KPIConfig.create({
        title: 'Bảng Lương KPI Chuẩn',
        odyleRate: 0.5,
        abyssRate: 0.1,
        bossHourRate: 1.5,
        baseHourlySalary: 50000,
        note: 'Quy đổi: Tổng giờ = (Odyle * odyleRate) + (Abyss * abyssRate) + (Boss * bossHourRate). Lương = Tổng giờ * Lương/giờ.'
      });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy cấu hình KPI', error: error.message });
  }
};

exports.updateKPIConfig = async (req, res) => {
  try {
    const { title, odyleRate, abyssRate, bossHourRate, baseHourlySalary, note } = req.body;
    let config = await KPIConfig.findOne().sort({ updatedAt: -1 });

    if (!config) {
      config = new KPIConfig();
    }

    if (title !== undefined) config.title = title;
    if (odyleRate !== undefined) config.odyleRate = Number(odyleRate);
    if (abyssRate !== undefined) config.abyssRate = Number(abyssRate);
    if (bossHourRate !== undefined) config.bossHourRate = Number(bossHourRate);
    if (baseHourlySalary !== undefined) config.baseHourlySalary = Number(baseHourlySalary);
    if (note !== undefined) config.note = note;

    await config.save();
    res.json({ message: 'Cập nhật bảng KPI & Công thức tính lương thành công', config });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật KPI', error: error.message });
  }
};
