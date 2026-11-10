import React, { useMemo } from 'react';

export const AuroraBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Tạo ngẫu nhiên các ngôi sao xuất hiện ở 35% chiều cao trang trở xuống
  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      topRaw: i * 17,
      left: `${(i * 23) % 98}%`,
      size: (i % 3) + 1.5,
      duration: ((i % 4) + 2),
      delay: (i % 5) * 0.7,
      opacity: ((i % 5) + 4) / 10,
    }));
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-heaven-gradient">
      {/* MÂY TRẮNG BỒNG BỀNH & VẦNG SÁNG */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div 
          className="absolute top-[10%] -left-[10%] w-[60vw] h-[400px] rounded-full opacity-60 blur-[80px] mix-blend-overlay animate-aurora-glow-1"
          style={{ background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.8), transparent 70%)' }}
        />
        <div 
          className="absolute top-[20%] -right-[10%] w-[50vw] h-[450px] rounded-full opacity-50 blur-[90px] mix-blend-overlay animate-aurora-glow-2"
          style={{ background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.7), transparent 70%)' }}
        />
        <div 
          className="absolute top-[60%] left-[20%] w-[70vw] h-[500px] rounded-full opacity-40 blur-[100px] mix-blend-overlay animate-aurora-glow-3"
          style={{ background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.6), transparent 70%)' }}
        />
        
        {/* Bong bóng lấp lánh (thay cho sao) */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white/60 animate-float-slow"
            style={{
              top: `${10 + (star.topRaw % 80)}%`,
              left: star.left,
              width: `${star.size * 2}px`,
              height: `${star.size * 2}px`,
              animationDuration: `${star.duration + 2}s`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity * 0.8,
              boxShadow: '0 4px 12px rgba(255, 255, 255, 0.4)',
            }}
          />
        ))}
      </div>

      {/* NỘI DUNG TOÀN TRANG NẰM TRÊN NỀN NÀY */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
