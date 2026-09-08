import React, { useEffect, useState } from 'react';
import CarouselHero from '../components/CarouselHero';
import api from '../services/api';
import { Calculator, Newspaper, FileWarning, HelpCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export const Home = () => {
  const [kpiConfig, setKpiConfig] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('news');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, postsRes] = await Promise.all([
          api.get('/kpi'),
          api.get('/posts')
        ]);
        setKpiConfig(kpiRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = posts.filter(p => p.category === activeTab);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Carousel Banner */}
      <CarouselHero />

      {/* KPI Payroll Rate Summary Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 20, 28, 0.9) 0%, rgba(15, 15, 20, 0.95) 100%)',
        border: '1px solid rgba(225, 29, 72, 0.3)',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#e11d48', padding: '10px', borderRadius: '12px', color: '#fff' }}>
            <Calculator size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
              {kpiConfig?.title || 'Bảng Lương & Quy Đổi KPI Tự Động'}
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Dựa vào các tham số này, hệ thống sẽ tự động tính ra tổng giờ làm và mức lương cho nhân viên khi gửi chấm công.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {/* Odyle Rate */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #ff2a55' }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>Tỷ lệ Odyle / Giờ</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '6px 0' }}>
              {kpiConfig?.odyleRate || 2} <span style={{ fontSize: '1rem', color: '#ff2a55' }}>Odyle = 1h</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Cần {kpiConfig?.odyleRate || 2} Odyle để quy đổi 1 giờ làm việc</div>
          </div>

          {/* Abyss Points Rate */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #e11d48' }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>Tỷ lệ Điểm Abyss / Giờ</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '6px 0' }}>
              {kpiConfig?.abyssRate || 10} <span style={{ fontSize: '1rem', color: '#e11d48' }}>Điểm = 1h</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Cần {kpiConfig?.abyssRate || 10} điểm Abyss để quy đổi 1 giờ làm việc</div>
          </div>

          {/* Boss Hours Rate */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #be123c' }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>Số Giờ Boss</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '6px 0' }}>
              x{kpiConfig?.bossHourRate || 1.5} <span style={{ fontSize: '1rem', color: '#be123c' }}>Hệ số</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Mỗi giờ săn Boss nhân hệ số {kpiConfig?.bossHourRate}h</div>
          </div>

          {/* Base Wage */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #22c55e' }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>Mức Lương Cơ Bản</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ade80', margin: '6px 0' }}>
              {(kpiConfig?.baseHourlySalary || 50000).toLocaleString('vi-VN')} <span style={{ fontSize: '1rem', color: '#a7f3d0' }}>đ / giờ</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Đơn giá tiền lương chi trả mỗi giờ làm</div>
          </div>
        </div>

        {kpiConfig?.note && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: '#d1d5db',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} color="#e11d48" />
            <span>{kpiConfig.note}</span>
          </div>
        )}
      </div>

      {/* News, Rules & FAQ Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Thông Tin & Nội Quy Hệ Thống
          </h3>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: '#13131a', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setActiveTab('news')}
              style={{
                background: activeTab === 'news' ? '#e11d48' : 'transparent',
                color: activeTab === 'news' ? '#fff' : '#9ca3af',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Newspaper size={16} /> Tin Tức
            </button>

            <button
              onClick={() => setActiveTab('rule')}
              style={{
                background: activeTab === 'rule' ? '#e11d48' : 'transparent',
                color: activeTab === 'rule' ? '#fff' : '#9ca3af',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <FileWarning size={16} /> Nội Quy (Lưu 2 tuần)
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              style={{
                background: activeTab === 'faq' ? '#e11d48' : 'transparent',
                color: activeTab === 'faq' ? '#fff' : '#9ca3af',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <HelpCircle size={16} /> FAQ Hỏi Đáp
            </button>
          </div>
        </div>

        {/* Post Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="badge-red" style={{ textTransform: 'uppercase' }}>
                      {post.category === 'news' ? 'Tin Tức' : post.category === 'rule' ? 'Nội Quy' : 'FAQ'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                    {post.title}
                  </h4>
                  <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {post.content}
                  </p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src={post.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="Author"
                    style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    Đăng bởi: {post.author?.fullName || 'Admin Hệ Thống'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlignment: 'center', padding: '40px', background: '#13131a', borderRadius: '16px', color: '#9ca3af' }}>
              Chưa có bài đăng nào trong mục này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
