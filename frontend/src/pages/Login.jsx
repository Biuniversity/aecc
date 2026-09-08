import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Flame, Lock, Mail, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px'
    }}>
      <div className="glass-card pulse-glow" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '36px 32px',
        background: 'linear-gradient(145deg, rgba(20, 18, 25, 0.95) 0%, rgba(10, 10, 14, 0.98) 100%)',
        border: '1px solid rgba(225, 29, 72, 0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #e11d48, #991b1b)',
            padding: '12px',
            borderRadius: '16px',
            boxShadow: '0 0 20px rgba(225, 29, 72, 0.5)',
            marginBottom: '16px'
          }}>
            <Flame size={32} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            Đăng Nhập <span style={{ color: '#ff2a55' }}>Hệ Thống</span>
          </h2>
        </div>

        {error && (
          <div style={{
            background: 'rgba(225, 29, 72, 0.15)',
            border: '1px solid rgba(225, 29, 72, 0.4)',
            color: '#ff4d6d',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '42px' }}
                placeholder="admin@manageapp.com hoặc nhanvien@..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
              Mật Khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                className="input-field"
                style={{ paddingLeft: '42px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="red-glow-btn"
            style={{ width: '100%', marginTop: '10px', padding: '14px', fontSize: '1rem' }}
          >
            {loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.9rem',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#ff2a55', textDecoration: 'none', fontWeight: 700 }}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
