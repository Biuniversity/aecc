import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Flame, 
  Home, 
  Clock, 
  Gamepad2, 
  Users, 
  FileText, 
  Sliders, 
  Newspaper, 
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  Camera
} from 'lucide-react';

export const Navbar = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  // Profile Popup Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    age: 24,
    phone: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openProfileModal = () => {
    if (!user) return;
    setProfileData({
      fullName: user.fullName || '',
      age: user.age || 24,
      phone: user.phone || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setShowPasswordSection(false);
    setAvatarPreview(user.avatarUrl || null);
    setNewAvatarFile(null);
    setProfileMsg('');
    setProfileError('');
    setProfileModalOpen(true);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');

    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        setProfileError('Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới');
        return;
      }
      if (profileData.newPassword !== profileData.confirmNewPassword) {
        setProfileError('Mật khẩu mới và xác nhận mật khẩu không trùng khớp');
        return;
      }
    }

    setUpdatingProfile(true);

    try {
      const formData = new FormData();
      formData.append('fullName', profileData.fullName);
      formData.append('age', profileData.age);
      formData.append('phone', profileData.phone);
      if (profileData.currentPassword) {
        formData.append('currentPassword', profileData.currentPassword);
      }
      if (profileData.newPassword) {
        formData.append('newPassword', profileData.newPassword);
      }
      if (newAvatarFile) {
        formData.append('avatar', newAvatarFile);
      }

      const res = await api.put('/auth/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUser(res.data);
      setProfileMsg('Cập nhật hồ sơ & mật khẩu thành công! ✓');
      setTimeout(() => {
        setProfileModalOpen(false);
      }, 1400);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 13, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(225, 29, 72, 0.2)',
        padding: '12px 24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand Logo Header: "WEB CHẤM CÔNG" */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #e11d48, #991b1b)',
              padding: '8px',
              borderRadius: '12px',
              boxShadow: '0 0 15px rgba(225, 29, 72, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px' }}>
                WEB <span style={{ color: '#ff2a55' }}>CHẤM CÔNG</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Hệ Thống Quản Lý KPI
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user && (
              <>
                <Link to="/" style={{
                  textDecoration: 'none',
                  color: isActive('/') ? '#ff2a55' : '#d1d5db',
                  fontWeight: isActive('/') ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: isActive('/') ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                  transition: 'all 0.2s'
                }}>
                  <Home size={18} />
                  Trang Chủ
                </Link>

                <Link to="/attendance/new" style={{
                  textDecoration: 'none',
                  color: isActive('/attendance/new') ? '#ff2a55' : '#d1d5db',
                  fontWeight: isActive('/attendance/new') ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: isActive('/attendance/new') ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                  transition: 'all 0.2s'
                }}>
                  <Clock size={18} />
                  Nhập Chấm Công
                </Link>

                <Link to="/game" style={{
                  textDecoration: 'none',
                  color: isActive('/game') ? '#ff2a55' : '#d1d5db',
                  fontWeight: isActive('/game') ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: isActive('/game') ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                  transition: 'all 0.2s'
                }}>
                  <Gamepad2 size={18} />
                  Baccarat 15s
                </Link>

                {/* Admin Menu Dropdown */}
                {user.role === 'admin' && (
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                      style={{
                        background: 'rgba(225, 29, 72, 0.2)',
                        border: '1px solid rgba(225, 29, 72, 0.4)',
                        color: '#ff4d6d',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ShieldCheck size={18} />
                      Quản Trị Admin
                      <ChevronDown size={14} />
                    </button>

                    {adminDropdownOpen && (
                      <div
                        onMouseLeave={() => setAdminDropdownOpen(false)}
                        style={{
                          position: 'absolute',
                          top: '120%',
                          right: 0,
                          width: '230px',
                          background: '#13131a',
                          border: '1px solid rgba(225, 29, 72, 0.3)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                          padding: '8px 0',
                          zIndex: 200
                        }}
                      >
                        <Link to="/admin/attendance" onClick={() => setAdminDropdownOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#e5e7eb', textDecoration: 'none', fontSize: '0.9rem'
                        }}>
                          <FileText size={16} color="#ff2a55" />
                          Xem Chấm Công Tuần
                        </Link>
                        <Link to="/admin/users" onClick={() => setAdminDropdownOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#e5e7eb', textDecoration: 'none', fontSize: '0.9rem'
                        }}>
                          <Users size={16} color="#ff2a55" />
                          Quản Lý Nhân Viên
                        </Link>
                        <Link to="/admin/kpi" onClick={() => setAdminDropdownOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#e5e7eb', textDecoration: 'none', fontSize: '0.9rem'
                        }}>
                          <Sliders size={16} color="#ff2a55" />
                          Quản Lý Bảng Lương KPI
                        </Link>
                        <Link to="/admin/posts" onClick={() => setAdminDropdownOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#e5e7eb', textDecoration: 'none', fontSize: '0.9rem'
                        }}>
                          <Newspaper size={16} color="#ff2a55" />
                          Quản Lý Bài Đăng / Nội Quy
                        </Link>
                        <Link to="/admin/carousel" onClick={() => setAdminDropdownOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#e5e7eb', textDecoration: 'none', fontSize: '0.9rem'
                        }}>
                          <ImageIcon size={16} color="#ff2a55" />
                          Quản Lý Banner Carousel
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* User Profile & Auth Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Clickable Avatar to Open Profile Modal */}
                <div
                  onClick={openProfileModal}
                  title="Bấm để xem và sửa thông tin cá nhân"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px 4px 4px',
                    borderRadius: '24px',
                    border: '1px solid rgba(225, 29, 72, 0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #e11d48'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                      {user.fullName}
                    </span>
                    <span className={user.role === 'admin' ? 'badge-red' : 'badge-green'} style={{ fontSize: '0.7rem', padding: '2px 6px', alignSelf: 'flex-start' }}>
                      {user.role === 'admin' ? 'ADMIN' : 'NHÂN VIÊN'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#9ca3af',
                    padding: '8px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button className="red-outline-btn">Đăng Nhập</button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button className="red-glow-btn">Đăng Ký</button>
                </Link>
              </div>
            )}

            {/* Mobile Drawer Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer'
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* USER PROFILE VIEW / EDIT POPUP MODAL */}
      {profileModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '480px',
            padding: '28px',
            background: 'linear-gradient(145deg, rgba(20, 18, 25, 0.98) 0%, rgba(10, 10, 14, 0.99) 100%)',
            border: '1px solid rgba(225, 29, 72, 0.4)',
            borderRadius: '20px',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setProfileModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={22} color="#ff2a55" />
              Thông Tin Hồ Sơ Cá Nhân
            </h3>

            {profileMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', padding: '10px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', textAlign: 'center' }}>
                {profileMsg}
              </div>
            )}

            {profileError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '10px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', textAlign: 'center' }}>
                {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Avatar Photo Edit Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={avatarPreview || user.avatarUrl}
                    alt="Avatar"
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #e11d48'
                    }}
                  />
                  <label style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#e11d48',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                  }}>
                    <Camera size={16} />
                    <input type="file" accept="image/*" onChange={handleAvatarFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Bấm biểu tượng camera để đổi ảnh đại diện</div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '4px', display: 'block' }}>
                  Họ và Tên
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    className="input-field"
                    style={{ paddingLeft: '38px' }}
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '4px', display: 'block' }}>
                  Email Đăng Nhập (Chỉ xem)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    disabled
                    className="input-field"
                    style={{ paddingLeft: '38px', opacity: 0.6, cursor: 'not-allowed' }}
                    value={profileData.email}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '4px', display: 'block' }}>
                    Tuổi
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: '38px' }}
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '4px', display: 'block' }}>
                    Số Điện Thoại
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      className="input-field"
                      style={{ paddingLeft: '38px' }}
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Section Toggle */}
              <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ff2a55',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 0
                  }}
                >
                  🔒 {showPasswordSection ? 'Thu gọn đổi mật khẩu' : 'Bấm vào đây nếu muốn ĐỔI MẬT KHẨU'}
                </button>

                {showPasswordSection && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(225, 29, 72, 0.2)' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>
                        1. Mật Khẩu Hiện Tại (Bắt buộc để xác thực) *
                      </label>
                      <input
                        type="password"
                        className="input-field"
                        placeholder="Nhập mật khẩu hiện tại..."
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>
                        2. Mật Khẩu Mới *
                      </label>
                      <input
                        type="password"
                        className="input-field"
                        placeholder="Nhập mật khẩu mới..."
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px', display: 'block' }}>
                        3. Nhập Lại Mật Khẩu Mới *
                      </label>
                      <input
                        type="password"
                        className="input-field"
                        placeholder="Nhập lại mật khẩu mới..."
                        value={profileData.confirmNewPassword}
                        onChange={(e) => setProfileData({ ...profileData, confirmNewPassword: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="red-glow-btn"
                  style={{ flex: 1, padding: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Save size={18} />
                  {updatingProfile ? 'Đang lưu...' : 'LƯU HỒ SƠ'}
                </button>

                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="red-outline-btn"
                  style={{ padding: '12px 18px' }}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
