const Attendance = require('../models/Attendance');
const KPIConfig = require('../models/KPIConfig');

// Helper to get active KPI config
const getActiveKPI = async () => {
  let config = await KPIConfig.findOne().sort({ updatedAt: -1 });
  if (!config) {
    config = {
      odyleRate: 0.5,
      abyssRate: 0.1,
      bossHourRate: 1.5,
      baseHourlySalary: 50000
    };
  }
  return config;
};

exports.previewCalculation = async (req, res) => {
  try {
    const { odyleCount = 0, abyssPoints = 0, bossHours = 0 } = req.body;
    const config = await getActiveKPI();

    const odyleHours = config.odyleRate > 0 ? (Number(odyleCount) / config.odyleRate) : 0;
    const abyssHours = config.abyssRate > 0 ? (Number(abyssPoints) / config.abyssRate) : 0;
    const bossH = Number(bossHours) * config.bossHourRate;

    const hours = odyleHours + abyssHours + bossH;
    const salary = Math.round(hours * config.baseHourlySalary);

    res.json({
      calculatedHours: Number(hours.toFixed(2)),
      calculatedSalary: salary,
      kpiRates: {
        odyleRate: config.odyleRate,
        abyssRate: config.abyssRate,
        bossHourRate: config.bossHourRate,
        baseHourlySalary: config.baseHourlySalary
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tính toán xem trước', error: error.message });
  }
};

exports.submitAttendance = async (req, res) => {
  try {
    const { odyleCount, abyssPoints, bossHours, note } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng tải lên hình ảnh minh chứng chấm công' });
    }

    const proofImage = req.file.path || `/uploads/${req.file.filename}`;
    const config = await getActiveKPI();

    const odyle = Number(odyleCount) || 0;
    const abyss = Number(abyssPoints) || 0;
    const boss = Number(bossHours) || 0;

    const odyleH = config.odyleRate > 0 ? (odyle / config.odyleRate) : 0;
    const abyssH = config.abyssRate > 0 ? (abyss / config.abyssRate) : 0;
    const bossH = boss * config.bossHourRate;

    const calculatedHours = Number((odyleH + abyssH + bossH).toFixed(2));
    const calculatedSalary = Math.round(calculatedHours * config.baseHourlySalary);

    const newAttendance = await Attendance.create({
      user: req.user._id,
      odyleCount: odyle,
      abyssPoints: abyss,
      bossHours: boss,
      proofImage,
      calculatedHours,
      calculatedSalary,
      status: 'approved',
      note: note || ''
    });

    await newAttendance.populate('user', 'fullName email avatarUrl phone');

    res.status(201).json({
      message: 'Nộp báo cáo chấm công thành công! Hệ thống đã tính toán và lưu lại thành quả.',
      attendance: newAttendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lưu báo cáo chấm công', error: error.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email avatarUrl');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử chấm công', error: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const { week, search } = req.query;
    let query = {};

    // Filter by timeframe if provided (e.g. week=current or date ranges)
    if (week === '1') {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: oneWeekAgo };
    }

    let records = await Attendance.find(query)
      .populate('user', 'fullName email avatarUrl age phone role')
      .sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      records = records.filter(r => 
        r.user && (
          r.user.fullName.toLowerCase().includes(term) ||
          r.user.email.toLowerCase().includes(term) ||
          r.user.phone.toLowerCase().includes(term)
        )
      );
    }

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách chấm công nhân viên', error: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { odyleCount, abyssPoints, bossHours, calculatedHours, calculatedSalary, status, note } = req.body;

    const record = await Attendance.findById(id);
    if (!record) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu chấm công' });
    }

    const config = await getActiveKPI();

    if (odyleCount !== undefined) record.odyleCount = Number(odyleCount);
    if (abyssPoints !== undefined) record.abyssPoints = Number(abyssPoints);
    if (bossHours !== undefined) record.bossHours = Number(bossHours);

    // Recalculate if provided or auto compute
    if (calculatedHours !== undefined) {
      record.calculatedHours = Number(calculatedHours);
    } else {
      const oH = config.odyleRate > 0 ? (record.odyleCount / config.odyleRate) : 0;
      const aH = config.abyssRate > 0 ? (record.abyssPoints / config.abyssRate) : 0;
      const bH = record.bossHours * config.bossHourRate;
      record.calculatedHours = Number((oH + aH + bH).toFixed(2));
    }

    if (calculatedSalary !== undefined) {
      record.calculatedSalary = Number(calculatedSalary);
    } else {
      record.calculatedSalary = Math.round(record.calculatedHours * config.baseHourlySalary);
    }

    if (status) record.status = status;
    if (note !== undefined) record.note = note;
    if (req.file) {
      record.proofImage = req.file.path || `/uploads/${req.file.filename}`;
    }

    await record.save();
    await record.populate('user', 'fullName email avatarUrl phone');

    res.json({ message: 'Cập nhật thành công phiếu chấm công', record });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi sửa phiếu chấm công', error: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Attendance.findByIdAndDelete(id);
    if (!record) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu chấm công để xóa' });
    }
    res.json({ message: 'Xóa phiếu chấm công thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa phiếu chấm công', error: error.message });
  }
};
