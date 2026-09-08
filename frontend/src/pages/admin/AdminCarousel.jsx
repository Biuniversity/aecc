import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Image as ImageIcon, Plus, Trash2, Edit, CheckCircle } from 'lucide-react';

export const AdminCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '#',
    order: 0,
    isActive: true
  });
  const [bannerFile, setBannerFile] = useState(null);

  const fetchSlides = async () => {
    try {
      const res = await api.get('/carousel');
      setSlides(res.data);
    } catch (err) {
      console.error('Error loading carousels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('linkUrl', formData.linkUrl);
      data.append('order', formData.order);
      data.append('isActive', formData.isActive);
      if (bannerFile) {
        data.append('banner', bannerFile);
      } else if (formData.imageUrl) {
        data.append('imageUrl', formData.imageUrl);
      }

      await api.post('/carousel', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAddForm(false);
      setBannerFile(null);
      setFormData({ title: '', description: '', imageUrl: '', linkUrl: '#', order: 0, isActive: true });
      fetchSlides();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi tạo Banner Carousel');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner Carousel này?')) return;
    try {
      await api.delete(`/carousel/${id}`);
      fetchSlides();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa Banner Carousel');
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
            <ImageIcon size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              Quản Lý Banner Carousel Trang Chủ
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Thêm, sửa, xóa các hình ảnh slider banner tự động chuyển động trên trang chủ.
            </p>
          </div>
        </div>

        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
          className="red-glow-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={20} />
          Thêm Banner Slide Mới
        </button>
      </div>

      {/* Add Banner Form */}
      {showAddForm && (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', borderLeft: '4px solid #ff2a55' }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontWeight: 800 }}>Tạo Slide Banner Mới</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Tiêu Đề Banner *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Ví dụ: Sự Kiện KPI Tháng 9..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Mô Tả Banner</label>
              <input
                type="text"
                className="input-field"
                placeholder="Mô tả chi tiết hiển thị trên banner..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Tải Ảnh Banner Tệp Tin</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files[0])}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Hoặc Dán URL Ảnh Banner</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="red-glow-btn" style={{ padding: '12px 24px' }}>Lưu Banner</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="red-outline-btn">Hủy</button>
            </div>
          </form>
        </div>
      )}

      {/* Slide List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Đang nạp danh sách banner...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {slides.map((slide) => (
            <div key={slide._id} className="glass-card" style={{ padding: '20px', overflow: 'hidden' }}>
              <img
                src={slide.imageUrl}
                alt={slide.title}
                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '14px' }}
              />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>{slide.title}</h4>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '14px' }}>{slide.description}</p>

              <button onClick={() => handleDelete(slide._id)} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Trash2 size={16} /> Xóa Slide Banner
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCarousel;
