import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Newspaper, Plus, Trash2, Edit, Pin } from 'lucide-react';

export const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'news',
    isPinned: false
  });

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', formData);
      setShowAddForm(false);
      setFormData({ title: '', content: '', category: 'news', isPinned: false });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi tạo bài đăng');
    }
  };

  const handleEditClick = (p) => {
    setEditingId(p._id);
    setFormData({
      title: p.title,
      content: p.content,
      category: p.category,
      isPinned: p.isPinned
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/posts/${editingId}`, formData);
      setEditingId(null);
      setFormData({ title: '', content: '', category: 'news', isPinned: false });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi sửa bài đăng');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài đăng này?')) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa bài đăng');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
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
            <Newspaper size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              Quản Lý Bài Đăng, Tin Tức, Nội Quy & FAQ
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Thêm, sửa, xóa thông tin thông báo, quy định và câu hỏi thường gặp hiển thị trên Trang Chủ.
            </p>
          </div>
        </div>

        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
          className="red-glow-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={20} />
          Thêm Bài Đăng Mới
        </button>
      </div>

      {/* Add / Edit Form Drawer */}
      {(showAddForm || editingId) && (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', borderLeft: '4px solid #ff2a55' }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontWeight: 800 }}>
            {editingId ? 'Chỉnh Sửa Bài Đăng' : 'Tạo Bài Đăng Mới'}
          </h3>
          <form onSubmit={editingId ? handleUpdate : handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Tiêu Đề Bài Đăng *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Nhập tiêu đề bài đăng..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Chuyên Mục *</label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="news">Tin Tức</option>
                  <option value="rule">Nội Quy / Quy Định</option>
                  <option value="faq">FAQ Hỏi Đáp</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '24px' }}>
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#e11d48', cursor: 'pointer' }}
                />
                <label htmlFor="isPinned" style={{ color: '#ffffff', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Ghim bài đăng lên đầu trang
                </label>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Nội Dung Chi Tiết *</label>
              <textarea
                required
                className="input-field"
                rows="4"
                placeholder="Nhập nội dung thông báo..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="red-glow-btn" style={{ padding: '12px 24px' }}>
                {editingId ? 'Lưu Thay Đổi' : 'Đăng Bài Ngay'}
              </button>
              <button type="button" onClick={() => { setShowAddForm(false); setEditingId(null); }} className="red-outline-btn">
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Đang nạp danh sách bài đăng...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {posts.map((post) => (
            <div key={post._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge-red" style={{ textTransform: 'uppercase' }}>
                    {post.category === 'news' ? 'Tin Tức' : post.category === 'rule' ? 'Nội Quy' : 'FAQ'}
                  </span>
                  {post.isPinned && (
                    <span style={{ fontSize: '0.75rem', color: '#ff2a55', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <Pin size={12} /> ĐÃ GHIM
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{post.title}</h4>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.6 }}>{post.content}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button onClick={() => handleEditClick(post)} className="red-outline-btn" style={{ flex: 1, padding: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Edit size={14} /> Sửa Bài
                </button>
                <button onClick={() => handleDelete(post._id)} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
