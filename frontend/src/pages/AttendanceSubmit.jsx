import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Clock, 
  Upload, 
  Calculator, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Award, 
  History,
  FileCheck
} from 'lucide-react';

export const AttendanceSubmit = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [odyleCount, setOdyleCount] = useState(0);
  const [abyssPoints, setAbyssPoints] = useState(0);
  const [bossHours, setBossHours] = useState(0);
  const [proofImage, setProofImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [note, setNote] = useState('');

  // Real-time calculation state
  const [calculatedHours, setCalculatedHours] = useState(0);
  const [calculatedSalary, setCalculatedSalary] = useState(0);
  const [kpiRates, setKpiRates] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch KPI rules and calculate preview whenever numbers change
  useEffect(() => {
    const calculateLive = async () => {
      try {
        const res = await api.post('/attendance/preview', {
          odyleCount: Number(odyleCount) || 0,
          abyssPoints: Number(abyssPoints) || 0,
          bossHours: Number(bossHours) || 0
        });
        setCalculatedHours(res.data.calculatedHours);
        setCalculatedSalary(res.data.calculatedSalary);
        setKpiRates(res.data.kpiRates);
      } catch (err) {
        console.error('Calculation error:', err);
      }
    };
    calculateLive();
  }, [odyleCount, abyssPoints, bossHours]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofImage) {
      setError('Vui lòng chọn hình ảnh chứng minh thành quả làm việc');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('odyleCount', odyleCount);
      formData.append('abyssPoints', abyssPoints);
      formData.append('bossHours', bossHours);
      formData.append('proofImage', proofImage);
      formData.append('note', note);

      const res = await api.post('/attendance/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMsg(res.data.message || 'Hệ thống đã ghi nhận phiếu chấm công!');
      setTimeout(() => {
        navigate('/attendance/history');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi nộp bài chấm công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.2) 0%, rgba(19, 19, 26, 0.9) 100%)',
        border: '1px solid rgba(225, 29, 72, 0.4)',
        borderRadius: '20px',
        padding: '24px 32px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#e11d48', padding: '14px', borderRadius: '16px', color: '#fff' }}>
            <Clock size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff' }}>
              Trang Nhập Chấm Công Nhân Viên
            </h2>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
              Nhập số lượng Odyle, điểm Abyss & số giờ Boss. Hệ thống sẽ tự động đối soát theo bảng KPI.
            </p>
          </div>
        </div>

        <Link to="/attendance/history" style={{ textDecoration: 'none' }}>
          <button className="red-outline-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} />
            Xem Lịch Sử Chấm Công
          </button>
        </Link>
      </div>

      {error && (
        <div style={{
          background: 'rgba(225, 29, 72, 0.15)',
          border: '1px solid rgba(225, 29, 72, 0.4)',
          color: '#ff4d6d',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Input Form */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={20} color="#ff2a55" />
            Thông Tin Chấm Công
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Odyle Count */}
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                1. Số Lượng Odyle *
              </label>
              <input
                type="number"
                min="0"
                required
                className="input-field"
                placeholder="Nhập số lượng Odyle (ví dụ: 10)"
                value={odyleCount}
                onChange={(e) => setOdyleCount(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                ({kpiRates?.odyleRate || 2} Odyle quy đổi được 1 giờ làm)
              </span>
            </div>

            {/* Abyss Points */}
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                2. Điểm Abyss *
              </label>
              <input
                type="number"
                min="0"
                required
                className="input-field"
                placeholder="Nhập điểm Abyss (ví dụ: 50)"
                value={abyssPoints}
                onChange={(e) => setAbyssPoints(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                ({kpiRates?.abyssRate || 10} điểm Abyss quy đổi được 1 giờ làm)
              </span>
            </div>

            {/* Boss Hours */}
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                3. Số Giờ Boss *
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                className="input-field"
                placeholder="Nhập số giờ đánh Boss (ví dụ: 4)"
                value={bossHours}
                onChange={(e) => setBossHours(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                (1 giờ Boss = x{kpiRates?.bossHourRate || 1.5} giờ làm)
              </span>
            </div>

            {/* Upload Proof Image */}
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                4. Hình Ảnh Chứng Minh (Ảnh chụp màn hình) *
              </label>
              <div style={{
                border: '2px dashed rgba(225, 29, 72, 0.4)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                background: '#0a0a0d',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                {previewUrl ? (
                  <div>
                    <img
                      src={previewUrl}
                      alt="Proof Preview"
                      style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', objectFit: 'contain', marginBottom: '10px' }}
                    />
                    <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>✓ Đã tải ảnh chứng minh</div>
                  </div>
                ) : (
                  <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={32} color="#ff2a55" />
                    <span style={{ fontSize: '0.9rem', color: '#d1d5db' }}>Bấm vào đây để chọn hình ảnh minh chứng</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', marginBottom: '6px' }}>
                Ghi Chú Cho Admin (Tùy chọn)
              </label>
              <textarea
                className="input-field"
                rows="2"
                placeholder="Ghi chú thêm về thành quả làm việc hôm nay..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="red-glow-btn"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '10px' }}
            >
              {loading ? 'Đang lưu vào hệ thống...' : 'XÁC NHẬN & LƯU CHẤM CÔNG'}
            </button>
          </form>
        </div>

        {/* Live Calculation Preview Card */}
        <div>
          <div className="glass-card pulse-glow" style={{
            padding: '28px',
            background: 'linear-gradient(135deg, rgba(25, 20, 30, 0.95) 0%, rgba(12, 12, 16, 0.98) 100%)',
            border: '1px solid rgba(225, 29, 72, 0.4)',
            position: 'sticky',
            top: '90px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calculator size={22} color="#ff2a55" />
              Kết Quả Tính Toán Tự Động
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Calculated Hours Display */}
              <div style={{
                background: 'rgba(10, 10, 14, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '0.85rem' }}>
                  <Award size={16} color="#ff2a55" /> TỔNG SỐ GIỜ LÀM VIỆC
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ff2a55', margin: '8px 0' }}>
                  {calculatedHours} <span style={{ fontSize: '1.2rem', color: '#ffffff' }}>GIỜ</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  = ({odyleCount} ÷ {kpiRates?.odyleRate || 2}) + ({abyssPoints} ÷ {kpiRates?.abyssRate || 10}) + ({bossHours} × {kpiRates?.bossHourRate || 1.5})
                </div>
              </div>

              {/* Calculated Salary Display */}
              <div style={{
                background: 'rgba(10, 10, 14, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '20px',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '0.85rem' }}>
                  <DollarSign size={16} color="#34d399" /> TỔNG TIỀN LƯƠNG NHẬN ĐƯỢC
                </div>
                <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#34d399', margin: '8px 0' }}>
                  {calculatedSalary.toLocaleString('vi-VN')} <span style={{ fontSize: '1.1rem', color: '#a7f3d0' }}>VNĐ</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  = {calculatedHours} giờ × {(kpiRates?.baseHourlySalary || 50000).toLocaleString('vi-VN')}đ / giờ
                </div>
              </div>

              <div style={{
                fontSize: '0.8rem',
                color: '#9ca3af',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '10px',
                lineHeight: 1.5
              }}>
                💡 <strong>Lưu ý:</strong> Kết quả trên được tính dựa trên bảng lương KPI hiện tại do Admin thiết lập. Khi bạn bấm <em>Xác nhận</em>, phiếu chấm công sẽ được lưu trữ chính thức.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSubmit;
