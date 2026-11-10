import React, { useEffect, useState } from 'react';

// Component hiển thị 1 con cừu đơn lẻ từ Spritesheet 5 cột x 7 hàng (35 frames)
export const SheepSprite: React.FC<{ size?: number; frameRate?: number }> = ({ 
  size = 54, 
  frameRate = 50 
}) => {
  const [frame, setFrame] = useState(0);
  const totalFrames = 35;
  const cols = 5;
  const rows = 7;

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, frameRate);
    return () => clearInterval(timer);
  }, [frameRate]);

  const colIndex = frame % cols;
  const rowIndex = Math.floor(frame / cols);

  // Tọa độ tính theo %: col * (100 / (cols - 1)), row * (100 / (rows - 1))
  const bgX = (colIndex * 100) / (cols - 1);
  const bgY = (rowIndex * 100) / (rows - 1);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size * 0.88}px`,
        backgroundImage: `url('/images/mascot/sheep.webp')`,
        backgroundPosition: `${bgX}% ${bgY}%`,
        backgroundSize: '500% 700%', // 5 cột x 7 hàng
        backgroundRepeat: 'no-repeat',
      }}
      className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] transition-transform select-none cursor-pointer hover:-translate-y-2 hover:scale-110 active:scale-95 pointer-events-auto"
    />
  );
};

// Cấu hình đàn cừu 6 con tự nhiên: kích thước, độ trễ, vị trí cao thấp
const SHEEP_FLOCK = [
  { id: 1, name: 'Đầu đàn', size: 58, duration: 22, delay: 0, bottom: 6, zIndex: 12, frameRate: 45 },
  { id: 2, name: 'Cặp đôi A', size: 48, duration: 20, delay: 2.2, bottom: 12, zIndex: 10, frameRate: 48 },
  { id: 3, name: 'Cặp đôi B (song song)', size: 52, duration: 20.4, delay: 2.6, bottom: 7, zIndex: 13, frameRate: 46 },
  { id: 4, name: 'Cừu nhỡ', size: 44, duration: 24, delay: 5.5, bottom: 10, zIndex: 11, frameRate: 52 },
  { id: 5, name: 'Cừu nhanh nhảu', size: 46, duration: 19, delay: 7.0, bottom: 8, zIndex: 12, frameRate: 44 },
  { id: 6, name: 'Cừu út lon ton', size: 36, duration: 21, delay: 9.2, bottom: 11, zIndex: 9, frameRate: 40 },
];

export default function RunningSheep() {
  return (
    <>
      <style>
        {`
          /* Chạy từ ngoài lề trái qua khỏi mép phải màn hình */
          @keyframes flockRun {
            0% {
              transform: translateX(-160px);
            }
            100% {
              transform: translateX(105vw);
            }
          }

          /* Nhún nhảy nhẹ nhàng mô phỏng cừu bước đi trên cỏ */
          @keyframes sheepBob {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-4px) rotate(2deg);
            }
          }

          .animate-flock-run {
            animation-name: flockRun;
          }

          .animate-sheep-bob {
            animation: sheepBob 0.6s ease-in-out infinite;
          }
        `}
      </style>
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-20">
        {SHEEP_FLOCK.map((sheep) => (
          <div
            key={sheep.id}
            className="absolute animate-flock-run"
            style={{
              bottom: `${sheep.bottom}px`,
              left: 0,
              zIndex: sheep.zIndex,
              animationDuration: `${sheep.duration}s`,
              animationDelay: `${sheep.delay}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear',
              transform: 'translateX(-160px)'
            }}
          >
            {/* Lồng thêm hiệu ứng nhún người nhè nhẹ theo nhịp bước chân */}
            <div className="animate-sheep-bob">
              <SheepSprite frameRate={sheep.frameRate} size={sheep.size} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
