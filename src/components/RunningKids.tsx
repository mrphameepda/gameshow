import React, { useEffect, useState } from 'react';

// Component trích xuất frame từ spritesheet linh hoạt
interface SpriteProps {
  imageSrc: string;
  cols: number;
  rows: number;
  totalFrames: number;
  size: number;
  aspectRatio?: number;
  frameRate?: number;
  flipX?: boolean;
}

export const AnimatedSprite: React.FC<SpriteProps> = ({
  imageSrc,
  cols,
  rows,
  totalFrames,
  size,
  aspectRatio = 1,
  frameRate = 50,
  flipX = false,
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, frameRate);
    return () => clearInterval(timer);
  }, [totalFrames, frameRate]);

  const colIndex = frame % cols;
  const rowIndex = Math.floor(frame / cols);

  const bgX = cols > 1 ? (colIndex * 100) / (cols - 1) : 0;
  const bgY = rows > 1 ? (rowIndex * 100) / (rows - 1) : 0;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size * aspectRatio}px`,
        backgroundImage: `url('${imageSrc}')`,
        backgroundPosition: `${bgX}% ${bgY}%`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        transform: flipX ? 'scaleX(-1)' : 'none',
      }}
      className="filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.15)] select-none pointer-events-auto cursor-pointer hover:scale-110 active:scale-95 transition-transform"
    />
  );
};

export default function RunningKids() {
  return (
    <>
      <style>
        {`
          @keyframes trackRun {
            0% { transform: translateX(-200px); }
            100% { transform: translateX(110vw); }
          }
          @keyframes gentleBob {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(2deg); }
          }
          @keyframes boyJump {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            20%, 80% { transform: translateY(-5px) rotate(-1deg); }
            50% { transform: translateY(-28px) rotate(-5deg) scale(1.05); }
          }
          .animate-track-run {
            animation: trackRun linear infinite;
            transform: translateX(-200px);
          }
          .animate-gentle-bob {
            animation: gentleBob 0.5s ease-in-out infinite;
          }
          .animate-boy-run-jump {
            animation: boyJump 1.2s ease-in-out infinite;
          }
        `}
      </style>
      <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-21">
        
        {/* CỤM ĐÔI BẠN NHỎ CHẠY CÙNG NHAU */}
        <div
          className="absolute bottom-2 left-0 animate-track-run flex items-end"
          style={{
            animationDuration: '20s',
            animationDelay: '1.5s',
            zIndex: 21,
          }}
        >
          {/* Bé gái chạy phía trước */}
          <div className="animate-gentle-bob relative">
            <AnimatedSprite 
              imageSrc="/images/mascot/girl-right-to-left.webp"
              cols={6}
              rows={6}
              totalFrames={36}
              size={65}
              aspectRatio={1}
              frameRate={50}
              flipX={false}
            />
          </div>

          {/* Bé trai chạy ngay phía sau lưng bé gái, vừa chạy vừa bật nhảy */}
          <div className="animate-boy-run-jump -ml-3 relative">
            <AnimatedSprite 
              imageSrc="/images/mascot/boy-run-jump.webp"
              cols={6}
              rows={6}
              totalFrames={36}
              size={70}
              aspectRatio={1}
              frameRate={45}
              flipX={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
