import React from 'react';
import { Flame, Facebook, Youtube, MessageSquare } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: '#070709',
      borderTop: '1px solid rgba(225, 29, 72, 0.15)',
      padding: '36px 24px',
      marginTop: '64px',
      color: '#9ca3af',
      fontSize: '0.9rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={22} color="#e11d48" />
          <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.2rem' }}>WEB<span style={{ color: '#ff2a55' }}>CHẤM CÔNG</span></span>
        </div>

        <p style={{ maxWidth: '600px', color: '#6b7280', lineHeight: 1.6 }}>
          Hệ Thống Quản Lý Chấm Công Nhân Viên Tự Động dựa trên chỉ số KPI (Odyle, Abyss, Boss). 
          Tự động dọn dẹp phiếu chấm công 2 tuần & Bảo mật cao cấp với JWT Authentication.
        </p>

        {/* Social Icons: Facebook, Discord, Youtube */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#1877f2',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            <Facebook size={20} />
          </a>

          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Discord"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#5865F2',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            <MessageSquare size={20} />
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ff0000',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            <Youtube size={20} />
          </a>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
          © 2026 WEB CHẤM CÔNG System. Tone Đỏ Đen Hiện Đại & Trải Nghiệm Mượt Mà.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
