import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Trash2, Edit2, ShieldAlert, ShieldCheck, Mail, Phone, Calendar, UserCheck } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', age: 24, phone: '', email: '', role: 'employee' });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (u) => {
    setEditingUser(u._id);
    setFormData({
      fullName: u.fullName,
      age: u.age || 24,
      phone: u.phone || '',
      email: u.email,
      role: u.role
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editingUser}`, formData);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật nhân viên');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}" khỏi hệ thống?`)) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa tài khoản này');
    }
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.2) 0%, rgba(19, 19, 26, 0.9) 100%)',
        border: '1px solid rgba(225, 29, 72, 0.4)',
        borderRadius: '20px',
        padding: '24px 32px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ background: '#e11d48', padding: '14px', borderRadius: '16px', color: '#fff' }}>
          <Users size={28} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
            Quản Lý Danh Sách & Tài Khoản Nhân Viên
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Xem đầy đủ thông tin: Họ tên, ảnh đại diện, tuổi, SĐT, email và phân quyền Admin/Nhân viên.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Đang tải danh sách tài khoản...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {users.map((u) => (
            <div key={u._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {editingUser === u._id ? (
                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ color: '#ff2a55', fontWeight: 700 }}>Chỉnh Sửa Nhân Viên</h4>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Họ và tên</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Tuổi</label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Vai trò</label>
                      <select
                        className="input-field"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="employee">Nhân Viên</option>
                        <option value="admin">Quản Trị (Admin)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Số Điện Thoại</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Email</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button type="submit" className="red-glow-btn" style={{ flex: 1, padding: '8px' }}>Lưu Thay Đổi</button>
                    <button type="button" onClick={() => setEditingUser(null)} className="red-outline-btn" style={{ padding: '8px 12px' }}>Hủy</button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={u.fullName}
                      style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e11d48' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{u.fullName}</h4>
                      <span className={u.role === 'admin' ? 'badge-red' : 'badge-green'}>
                        {u.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 'NHÂN VIÊN'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#d1d5db', background: '#0a0a0d', padding: '14px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="#ff2a55" /> Tuổi: <strong style={{ color: '#fff' }}>{u.age || 'N/A'}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} color="#ff2a55" /> SĐT: <strong style={{ color: '#fff' }}>{u.phone || 'Chưa cập nhật'}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} color="#ff2a55" /> Email: <strong style={{ color: '#fff' }}>{u.email}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button onClick={() => handleEditClick(u)} className="red-outline-btn" style={{ flex: 1, padding: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Edit2 size={16} /> Sửa Thông Tin
                    </button>
                    <button onClick={() => handleDelete(u._id, u.fullName)} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
