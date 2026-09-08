import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  FileText, 
  Trash2, 
  Edit3, 
  Search, 
  Calendar, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';

export const AdminAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [weekFilter, setWeekFilter] = useState('all');

  const [selectedImage, setSelectedImage] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    odyleCount: 0,
    abyssPoints: 0,
    bossHours: 0,
    calculatedHours: 0,
    calculatedSalary: 0,
    status: 'approved'
  });

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/all?search=${search}&week=${weekFilter === 'week1' ? '1' : ''}`);
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching attendance list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [search, weekFilter]);

  const handleEditClick = (rec) => {
    setEditingRecord(rec._id);
    setEditForm({
      odyleCount: rec.odyleCount,
      abyssPoints: rec.abyssPoints,
      bossHours: rec.bossHours,
      calculatedHours: rec.calculatedHours,
      calculatedSalary: rec.calculatedSalary,
      status: rec.status
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/attendance/${editingRecord}`, editForm);
      setEditingRecord(null);
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật phiếu chấm công');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành quả chấm công này?')) return;
    try {
      await api.delete(`/attendance/${id}`);
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa bài chấm công');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Page Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.2) 0%, rgba(19, 19, 26, 0.9) 100%)',
        border: '1px solid rgba(225, 29, 72, 0.4)',
        borderRadius: '20px',
        padding: '24px 32px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#e11d48', padding: '14px', borderRadius: '16px', color: '#fff' }}>
            <FileText size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              Duyệt & Quản Lý Chấm Công Nhân Viên Theo Tuần
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Quản trị viên có thể xem, chỉnh sửa, xóa phiếu chấm công của nhân viên.
            </p>
          </div>
        </div>

        {/* 2-Week Auto Purge Notice Badge */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#f87171',
          padding: '10px 16px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '380px'
        }}>
          <AlertTriangle size={20} />
          <span>Hệ thống tự động xóa dữ liệu chấm công cũ hơn 2 tuần (14 ngày).</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '42px' }}
            placeholder="Tìm theo tên nhân viên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setWeekFilter('all')}
            style={{
              background: weekFilter === 'all' ? '#e11d48' : '#13131a',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Tất Cả Phiếu
          </button>
          <button
            onClick={() => setWeekFilter('week1')}
            style={{
              background: weekFilter === 'week1' ? '#e11d48' : '#13131a',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Trong 1 Tuần Gần Nhất
          </button>
        </div>
      </div>

      {/* Attendance Entries Grid / Table */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Đang nạp danh sách chấm công...</div>
      ) : records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#13131a', borderRadius: '16px', color: '#9ca3af' }}>
          Không tìm thấy phiếu chấm công nào phù hợp với bộ lọc.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {records.map((rec) => (
            <div key={rec._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {editingRecord === rec._id ? (
                /* Edit Form Modal/Card */
                <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ color: '#ff2a55', fontWeight: 700 }}>Sửa Phiếu Chấm Công</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Odyle</label>
                      <input
                        type="number"
                        className="input-field"
                        value={editForm.odyleCount}
                        onChange={(e) => setEditForm({ ...editForm, odyleCount: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Abyss</label>
                      <input
                        type="number"
                        className="input-field"
                        value={editForm.abyssPoints}
                        onChange={(e) => setEditForm({ ...editForm, abyssPoints: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Boss(h)</label>
                      <input
                        type="number"
                        className="input-field"
                        value={editForm.bossHours}
                        onChange={(e) => setEditForm({ ...editForm, bossHours: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Tổng Giờ (h)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        value={editForm.calculatedHours}
                        onChange={(e) => setEditForm({ ...editForm, calculatedHours: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Lương (VNĐ)</label>
                      <input
                        type="number"
                        className="input-field"
                        value={editForm.calculatedSalary}
                        onChange={(e) => setEditForm({ ...editForm, calculatedSalary: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button type="submit" className="red-glow-btn" style={{ flex: 1, padding: '8px' }}>Lưu Thay Đổi</button>
                    <button type="button" onClick={() => setEditingRecord(null)} className="red-outline-btn" style={{ padding: '8px 12px' }}>Hủy</button>
                  </div>
                </form>
              ) : (
                /* Card View Mode */
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <img
                      src={rec.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt="Avatar"
                      style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #e11d48' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                        {rec.user?.fullName || 'Nhân Viên Mới'}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                        {rec.user?.email} • {rec.user?.phone || 'No phone'}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="#ff2a55" />
                    Thời gian gửi: {new Date(rec.createdAt).toLocaleString('vi-VN')}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: '#0a0a0d', padding: '12px', borderRadius: '12px', marginBottom: '14px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Odyle</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{rec.odyleCount}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Abyss</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{rec.abyssPoints}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Boss</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{rec.bossHours}h</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(225, 29, 72, 0.1)', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Tính Toán Giờ</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ff2a55' }}>{rec.calculatedHours} giờ</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Tiền Lương Tương Ứng</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{rec.calculatedSalary.toLocaleString('vi-VN')}đ</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedImage(rec.proofImage)}
                      className="red-outline-btn"
                      style={{ flex: 1, padding: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <ImageIcon size={14} /> Xem Ảnh Minh Chứng
                    </button>
                    <button onClick={() => handleEditClick(rec)} style={{ background: '#1a1a24', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(rec._id)} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Proof Lightbox */}
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
          <div style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'hidden', borderRadius: '16px', border: '2px solid #e11d48' }}>
            <img src={selectedImage} alt="Proof" style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
