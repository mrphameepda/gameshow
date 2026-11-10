import { useEffect, useRef } from 'react';

interface Props {
  className?: string;
  fps?: number;
}

export default function JesusMascot({ className = "w-32 h-32", fps = 24 }: Props) {
  const spriteRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();
    const interval = 1000 / fps;
    let animationFrameId: number;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      if (deltaTime > interval) {
        frame = (frame + 1) % 36;
        const col = frame % 6;
        const row = Math.floor(frame / 6);
        
        if (spriteRef.current) {
          spriteRef.current.style.backgroundPosition = `${col * 20}% ${row * 20}%`;
        }
        
        // Correct time for smooth animation compensating for missed frames
        lastTime = time - (deltaTime % interval);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [fps]);

  return (
    <div 
      ref={spriteRef}
      className={`inline-block ${className}`}
      style={{
        backgroundImage: "url('/images/mascot/jesus-waving-sheet.webp')",
        backgroundSize: '600% 600%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0% 0%',
      }}
    />
  );
}
