import React, { useEffect, useState } from 'react';

// Đám mây có biểu cảm (Spritesheet 3x4 = 12 frames)
export const AnimatedCloudSprite: React.FC<{ size?: number }> = ({ size = 90 }) => {
  const [frame, setFrame] = useState(0);
  const totalFrames = 12;
  const cols = 3;
  const rows = 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, 120); // Đổi biểu cảm chớp mắt mượt mà
    return () => clearInterval(timer);
  }, []);

  const colIndex = frame % cols;
  const rowIndex = Math.floor(frame / cols);
  const bgX = (colIndex * 100) / (cols - 1);
  const bgY = (rowIndex * 100) / (rows - 1);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size * 0.65}px`,
        backgroundImage: `url('/images/mascot/cloud_1.webp')`,
        backgroundPosition: `${bgX}% ${bgY}%`,
        backgroundSize: '300% 400%', // 3 cột x 4 hàng
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
      className="filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.08)] select-none"
    />
  );
};

export default function SkyDecorations() {
  return (
    <>
      <style>
        {`
          @keyframes cloudDrift {
            0% {
              transform: translateX(-180px);
            }
            100% {
              transform: translateX(110vw);
            }
          }

          .animate-cloud-drift-fast {
            animation: cloudDrift 40s linear infinite;
          }

          .animate-cloud-drift-medium {
            animation: cloudDrift 55s linear infinite;
          }
          
          .animate-cloud-drift-slow {
            animation: cloudDrift 70s linear infinite;
          }
        `}
      </style>
      
      {/* ĐÀN CHIM CHAO LIỆNG */}
      <div className="absolute top-10 left-1/4 pointer-events-none z-10 opacity-80 animate-birds-flight">
        <div className="flex gap-4 items-center">
          {/* Chim 1 (dẫn đầu) */}
          <svg viewBox="0 0 30 18" className="w-5 h-3 text-sky-100 animate-wing-flap">
            <path d="M 0,10 Q 7,0 15,10 Q 23,0 30,10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          {/* Chim 2 */}
          <svg viewBox="0 0 30 18" className="w-4 h-2.5 text-sky-200 -mt-3 animate-wing-flap" style={{ animationDelay: '0.2s' }}>
            <path d="M 0,10 Q 7,0 15,10 Q 23,0 30,10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          {/* Chim 3 */}
          <svg viewBox="0 0 30 18" className="w-3.5 h-2 text-sky-200 mt-2 animate-wing-flap" style={{ animationDelay: '0.4s' }}>
            <path d="M 0,10 Q 7,0 15,10 Q 23,0 30,10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* MẶT TRĂNG KHUYẾT / MẶT TRỜI ĐÊM CỰC QUANG */}
      <img 
        src="/images/mascot/cloud_sun.webp" 
        alt="Sun" 
        className="absolute top-3 right-4 sm:right-10 w-24 sm:w-32 md:w-40 z-10 pointer-events-none animate-pulse opacity-60 mix-blend-screen drop-shadow-[0_8px_25px_rgba(255,255,255,0.4)]" 
        style={{ animationDuration: '4000ms', filter: 'hue-rotate(180deg) saturate(0.2) brightness(1.5)' }}
      />

      {/* CỤM MÂY LỚN (Đám mây tĩnh, trôi chậm) */}
      <div className="absolute top-6 left-0 animate-cloud-drift-medium z-10 pointer-events-none">
        <img src="/images/mascot/cloud_2.webp" alt="Cloud" className="w-32 sm:w-40 opacity-95 drop-shadow-md" />
      </div>

      {/* CỤM MÂY VỪA (Đám mây biểu cảm Spritesheet) */}
      <div className="absolute top-12 left-0 animate-cloud-drift-fast z-10 pointer-events-none">
        <AnimatedCloudSprite size={95} />
      </div>

      {/* CỤM MÂY NHỎ (Tầng xa) */}
      <div 
        className="absolute top-20 left-0 animate-cloud-drift-slow z-0 pointer-events-none"
        style={{ animationDelay: '-12s' }}
      >
        <img src="/images/mascot/cloud_2.webp" alt="Cloud" className="w-16 sm:w-20 opacity-65 drop-shadow-sm" />
      </div>

      {/* CỤM MÂY CHÂN CẦU VỒNG (Cố định góc trái) */}
      <div className="absolute top-[180px] -left-8 md:top-[220px] md:left-4 z-10 pointer-events-none opacity-85">
        <img src="/images/mascot/cloud_2.webp" alt="Cloud" className="w-24 sm:w-32 drop-shadow-md" />
      </div>
    </>
  );
}
