import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { History, Calendar, CheckCircle2, Clock, Image as ImageIcon } from 'lucide-react';

export const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/attendance/my');
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching attendance history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.15) 0%, rgba(19, 19, 26, 0.9) 100%)',
        border: '1px solid rgba(225, 29, 72, 0.3)',
        borderRadius: '20px',
        padding: '24px 32px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ background: '#e11d48', padding: '14px', borderRadius: '16px', color: '#fff' }}>
          <History size={28} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
            Lịch Sử Chấm Công Của Bạn
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Danh sách các thành quả chấm công đã gửi. Lưu ý: Dữ liệu được hệ thống lưu giữ 2 tuần (14 ngày).
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Đang tải lịch sử...</div>
      ) : history.length === 0 ? (
        <div style={{ textAlignment: 'center', padding: '40px', background: '#13131a', borderRadius: '16px', color: '#9ca3af', textAlign: 'center' }}>
          Bạn chưa gửi phiếu chấm công nào. Hãy sang trang <strong>Nhập Chấm Công</strong> để gửi thành quả đầu tiên!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {history.map((item) => (
            <div key={item._id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="#ff2a55" />
                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                  </span>
                  <span className="badge-green">
                    Đã Lưu ✓
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: '#0a0a0d', padding: '12px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Odyle</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{item.odyleCount}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Abyss</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{item.abyssPoints}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Giờ Boss</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{item.bossHours}h</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', background: 'rgba(225, 29, 72, 0.1)', padding: '10px 14px', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Tổng Giờ Làm</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ff2a55' }}>{item.calculatedHours} giờ</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Lương Quy Đổi</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{item.calculatedSalary.toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>
              </div>

              {/* Proof Image Button */}
              {item.proofImage && (
                <button
                  onClick={() => setSelectedImage(item.proofImage)}
                  style={{
                    background: '#1a1a24',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#d1d5db',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  <ImageIcon size={16} color="#ff2a55" /> Xem Ảnh Chứng Minh
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setSelectedImage(null)}>
          <div style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'hidden', borderRadius: '16px', border: '1px solid #e11d48' }}>
            <img src={selectedImage} alt="Proof" style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
