import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Sliders, Save, CheckCircle, AlertCircle, Calculator } from 'lucide-react';

export const AdminKPI = () => {
  const [config, setConfig] = useState({
    title: 'Bảng Barem KPI & Lương Thưởng',
    odyleRate: 0.5,
    abyssRate: 0.1,
    bossHourRate: 1.5,
    baseHourlySalary: 60000,
    note: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const res = await api.get('/kpi');
        if (res.data) {
          setConfig(res.data);
        }
      } catch (err) {
        console.error('Error fetching KPI config:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKPI();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    try {
      const res = await api.put('/kpi', config);
      setMsg(res.data.message || 'Cập nhật bảng KPI & công thức tính lương thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bảng KPI');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
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
          <Sliders size={28} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
            Quản Lý Công Thức KPI & Bảng Lương
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Điều chỉnh hệ số quy đổi Odyle, Điểm Abyss, Giờ Boss và đơn giá tiền lương mỗi giờ.
          </p>
        </div>
      </div>

      {msg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', padding: '14px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '14px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Đang tải công thức...</div>
      ) : (
        <div className="glass-card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                Tiêu Đề Bảng KPI / Công Thức
              </label>
              <input
                type="text"
                required
                className="input-field"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                  Số Lượng Odyle Cho 1 Giờ Làm (odyleRate)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="input-field"
                  value={config.odyleRate}
                  onChange={(e) => setConfig({ ...config, odyleRate: Number(e.target.value) })}
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Ví dụ: nhập 2 nghĩa là 2 Odyle quy đổi được 1 giờ làm
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                  Số Điểm Abyss Cho 1 Giờ Làm (abyssRate)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  className="input-field"
                  value={config.abyssRate}
                  onChange={(e) => setConfig({ ...config, abyssRate: Number(e.target.value) })}
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Ví dụ: nhập 10 nghĩa là 10 điểm Abyss quy đổi được 1 giờ làm
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                  Hệ Số Giờ Boss (bossHourRate)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="input-field"
                  value={config.bossHourRate}
                  onChange={(e) => setConfig({ ...config, bossHourRate: Number(e.target.value) })}
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Ví dụ: nhập 1.5 nghĩa là 1 giờ Boss nhân hệ số 1.5h
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                  Mức Lương Cơ Bản / 1 Giờ (baseHourlySalary)
                </label>
                <input
                  type="number"
                  step="1000"
                  required
                  className="input-field"
                  value={config.baseHourlySalary}
                  onChange={(e) => setConfig({ ...config, baseHourlySalary: Number(e.target.value) })}
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Đơn vị VNĐ (Ví dụ: 60.000đ / giờ làm)
                </span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                Ghi Chú Hướng Dẫn Tính Lương
              </label>
              <textarea
                className="input-field"
                rows="3"
                value={config.note || ''}
                onChange={(e) => setConfig({ ...config, note: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="red-glow-btn"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Save size={20} />
              {saving ? 'Đang cập nhật công thức...' : 'LƯU THAY ĐỔI CÔNG THỨC BẢNG LƯƠNG'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminKPI;
