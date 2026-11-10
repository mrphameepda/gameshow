import React from 'react';

export const AuroraNightSky: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. LỚP NỀN TRỜI ĐÊM HUYỀN DIỆU */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f29] via-[#0f173a] to-[#1e293b]" />

      {/* 2. DẢI CỰC QUANG AURORA CHUYỂN ĐỘNG (DÙNG RADIAL GRADIENT VÀ KEYFRAMES) */}
      <div className="absolute -inset-[20%] opacity-70 blur-[50px] mix-blend-screen animate-aurora-wave">
        {/* Vệt xanh ngọc lục bảo */}
        <div className="absolute top-[10%] left-[15%] w-[60vw] h-[350px] rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500 opacity-60 animate-aurora-pulse" />
        {/* Vệt tím thạch anh & hồng cực quang */}
        <div className="absolute top-[5%] right-[20%] w-[50vw] h-[300px] rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 opacity-50 animate-aurora-shift" />
      </div>

      {/* 3. BẦU TRỜI SAO LẤP LÁNH (TWINKLE STARS) */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 55}%`,
              left: `${Math.random() * 98}%`,
              width: `${Math.random() * 3 + 1.5}px`,
              height: `${Math.random() * 3 + 1.5}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${Math.random() * 2 + 1.5}s`,
              animationDelay: `${Math.random() * 3}s`,
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
            }}
          />
        ))}
      </div>

      {/* 4. SAO CHỔI / SAO BĂNG BAY VÚT QUA (SHOOTING STAR) */}
      <div className="shooting-star" />
      <div className="shooting-star-delayed" />
    </div>
  );
};
