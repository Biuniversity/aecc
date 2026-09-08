import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CarouselHero = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const res = await api.get('/carousel?activeOnly=true');
        if (res.data && res.data.length > 0) {
          setSlides(res.data);
        } else {
          // Fallback slides
          setSlides([
            {
              title: 'Hệ Thống Chấm Công KPI 2026',
              description: 'Tính toán số giờ làm và bảng lương tự động từ số Odyle, điểm Abyss & giờ Boss.',
              imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200'
            },
            {
              title: 'Minigame Baccarat 15s Cho Nhân Viên',
              description: 'Đặt cược Cái/Con miễn phí, thư giãn sau những giờ làm việc căng thẳng.',
              imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200'
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading carousels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCarousels();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (loading || slides.length === 0) {
    return (
      <div style={{ height: '360px', background: '#13131a', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9ca3af' }}>Đang tải Banner...</div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '260px',
      height: 'clamp(260px, 40vh, 380px)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
      border: '1px solid rgba(225, 29, 72, 0.2)',
      marginBottom: '32px'
    }}>
      {/* Background Image with Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(to right, rgba(10, 10, 13, 0.95) 20%, rgba(10, 10, 13, 0.4) 100%), url(${currentSlide.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'all 0.7s ease-in-out'
      }} />

      {/* Slide Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px 20px',
        maxWidth: '650px'
      }}>
        <div style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          background: 'rgba(225, 29, 72, 0.2)',
          color: '#ff2a55',
          border: '1px solid rgba(225, 29, 72, 0.4)',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '12px',
          letterSpacing: '0.5px'
        }}>
          NỔI BẬT HỆ THỐNG
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
          {currentSlide.title}
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#d1d5db', marginBottom: '24px' }}>
          {currentSlide.description}
        </p>
      </div>

      {/* Prev / Next Buttons */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(19, 19, 26, 0.7)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(19, 19, 26, 0.7)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicator Dots */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: '8px'
      }}>
        {slides.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? '28px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: idx === currentIndex ? '#ff2a55' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselHero;
