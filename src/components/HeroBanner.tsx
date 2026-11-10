import { useState, useEffect, useRef } from 'react'

interface HeroBannerProps {
  onStartClick?: () => void
}

export function HeroBanner({ onStartClick }: HeroBannerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio('/audio/theme-song.mp3')
    audio.loop = false
    audio.volume = 0
    audioRef.current = audio

    const fadeIn = () => {
      let currentVol = 0
      const targetVol = 0.45
      const interval = setInterval(() => {
        if (currentVol < targetVol) {
          currentVol = Math.min(targetVol, currentVol + 0.03)
          audio.volume = currentVol
        } else {
          clearInterval(interval)
        }
      }, 200)
    }

    const startPlay = () => {
      audio.play().then(() => {
        setIsPlaying(true)
        fadeIn()
      }).catch(() => {
        // Trình duyệt chặn Autoplay -> Chờ tương tác đầu tiên của người dùng
        const handleFirstInteraction = () => {
          audio.play().then(() => {
            setIsPlaying(true)
            fadeIn()
          }).catch(console.error)
          window.removeEventListener('click', handleFirstInteraction)
          window.removeEventListener('keydown', handleFirstInteraction)
          window.removeEventListener('touchstart', handleFirstInteraction)
        }
        window.addEventListener('click', handleFirstInteraction)
        window.addEventListener('keydown', handleFirstInteraction)
        window.addEventListener('touchstart', handleFirstInteraction)
      })
    }

    startPlay()

    audio.onended = () => {
      setIsPlaying(false)
    }

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(console.error)
    }
  }

  const handleScroll = () => {
    if (onStartClick) {
      onStartClick()
    } else {
      const el = document.getElementById('games-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="w-full relative overflow-hidden bg-transparent pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-24 select-none">
      
      {/* 1. HOA VĂN CHÌM PHỦ TOÀN BỘ KHU VỰC (FULL-WIDTH WATERMARK) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Biểu tượng Công Giáo & Gamepad chìm */}
        <div className="absolute inset-0 opacity-20 text-sky-300 font-bold select-none">
          {/* Hàng 1 */}
          <div className="absolute top-6 left-[5%] text-2xl">✝</div>
          <div className="absolute top-8 left-[18%] text-xl tracking-tighter">AΩ</div>
          <div className="absolute top-6 left-[32%] text-2xl">🕊️</div>
          <div className="absolute top-10 left-[45%] text-2xl">✝</div>
          <div className="absolute top-7 left-[60%] text-xl tracking-tighter">AΩ</div>
          <div className="absolute top-6 left-[75%] text-2xl">🕊️</div>
          <div className="absolute top-9 left-[88%] text-2xl">✝</div>

          {/* Hàng 2 */}
          <div className="absolute top-28 left-[8%] text-2xl">🕊️</div>
          <div className="absolute top-24 left-[25%] text-2xl">✝</div>
          <div className="absolute top-32 left-[40%] text-xl tracking-tighter">AΩ</div>
          <div className="absolute top-24 left-[55%] text-2xl">🕊️</div>
          <div className="absolute top-28 left-[70%] text-2xl">✝</div>
          <div className="absolute top-26 left-[85%] text-xl tracking-tighter">AΩ</div>

          {/* Hàng 3 */}
          <div className="absolute top-52 left-[3%] text-xl tracking-tighter">AΩ</div>
          <div className="absolute top-48 left-[15%] text-2xl">🕊️</div>
          <div className="absolute top-56 left-[30%] text-2xl">✝</div>
          <div className="absolute top-48 left-[48%] text-xl tracking-tighter">AΩ</div>
          <div className="absolute top-52 left-[65%] text-2xl">🕊️</div>
          <div className="absolute top-48 left-[80%] text-2xl">✝</div>

          {/* Hàng Dưới */}
          <div className="absolute bottom-16 left-[6%] text-2xl">🕊️</div>
          <div className="absolute bottom-20 left-[22%] text-xl tracking-tighter">AΩ</div>
          <div className="absolute bottom-16 left-[38%] text-2xl">✝</div>
          <div className="absolute bottom-24 left-[54%] text-xl tracking-tighter">AΩ</div>
          <div className="absolute bottom-16 left-[72%] text-2xl">✝</div>
          <div className="absolute bottom-18 left-[88%] text-2xl">🕊️</div>
        </div>

        {/* Gamepad Watermark Vector 1 (Góc trên phải) */}
        <svg className="absolute -top-10 right-10 w-72 h-72 opacity-20 text-sky-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>

        {/* Gamepad Watermark Vector 2 (Góc dưới trái) */}
        <svg className="absolute -bottom-16 -left-10 w-80 h-80 opacity-20 text-sky-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>

        {/* Nút 3D tròn Pastel lơ lửng góc trên */}
        <div className="absolute top-10 right-16 flex gap-2.5 opacity-80">
          <div className="w-5 h-5 rounded-full bg-[#f87171] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
          <div className="w-5 h-5 rounded-full bg-[#fbbf24] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
          <div className="w-5 h-5 rounded-full bg-[#60a5fa] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
          <div className="w-5 h-5 rounded-full bg-[#4ade80] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
        </div>

        {/* Nút 3D tròn Pastel lơ lửng góc dưới */}
        <div className="absolute bottom-16 left-12 flex gap-2.5 opacity-80">
          <div className="w-6 h-6 rounded-full bg-[#f87171] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
          <div className="w-6 h-6 rounded-full bg-[#fbbf24] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
          <div className="w-6 h-6 rounded-full bg-[#60a5fa] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
        </div>
      </div>

      {/* 2. INNER CONTAINER CĂN GIỮA NỘI DUNG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between min-h-[460px] md:min-h-[520px]">
        
        {/* KHỐI 1 (MOBILE & DESKTOP): TIÊU ĐỀ & SLOGAN */}
        <div className="w-full md:w-[50%] flex flex-col items-center md:items-start text-center md:text-left z-10 order-1">
          {/* RUY BĂNG "VỪA CHƠI VỪA HỌC" */}
          <div className="bg-[#3b82f6] text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded shadow -rotate-3 mb-4 inline-block tracking-wider">
            VỪA CHƠI VỪA HỌC
          </div>

          {/* TIÊU ĐỀ CHÍNH COOKII DISPLAY STICKER 3D NHÚN NHẢY */}
          <div className="flex flex-col items-center md:items-start select-none my-3">
            <div className="sticker-3d-wrapper animate-cartoon-bounce-1">
              <h1 
                style={{ fontFamily: "'CookiiDisplay', 'CookiiLocal', 'Fredoka', 'Baloo 2', cursive, sans-serif" }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold uppercase leading-tight text-game-3d-v3 tracking-wide"
              >
                VUI HỌC CÙNG
              </h1>
            </div>
            <div className="sticker-3d-wrapper-gold animate-cartoon-bounce-2 mt-1.5">
              <h1 
                style={{ fontFamily: "'CookiiDisplay', 'CookiiLocal', 'Fredoka', 'Baloo 2', cursive, sans-serif" }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold uppercase leading-tight text-game-3d-gold tracking-wide"
              >
                THẦY GIÊSU
              </h1>
            </div>

            {/* Slogan phụ làm sáng rõ ràng, dễ đọc */}
            <p className="text-amber-500 font-extrabold text-sm sm:text-base tracking-[0.25em] uppercase mt-4 mb-3">
              GAME SHOW CÔNG GIÁO CHO THIẾU NHI
            </p>
          </div>

          {/* CỤM NÚT DÀNH RIÊNG CHO DESKTOP (Ẩn trên Mobile) */}
          <div className="hidden md:flex flex-col items-start gap-3 mt-2">
            <button
              onClick={handleScroll}
              className="btn-cartoon-3d text-xl sm:text-2xl px-10 py-4 shadow-[0_8px_16px_rgba(245,158,11,0.4)] animate-bounce-subtle"
            >
              THAM GIA NGAY!
            </button>

            {/* NÚT ĐIỀU KHIỂN NHẠC CHỦ ĐỀ */}
            <button 
              onClick={togglePlay}
              aria-label={isPlaying ? "Dừng nhạc chủ đề" : "Phát nhạc chủ đề"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-sky-200 text-sky-800 text-xs font-bold shadow-sm transition-all hover:bg-sky-50 active:scale-95 cursor-pointer select-none"
            >
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[10px] font-bold shadow-xs">
                {isPlaying ? '⏸' : '▶'}
              </span>
              <span>{isPlaying ? 'Tạm dừng nhạc' : 'Bật nhạc chủ đề'}</span>
              <div className="flex items-center gap-0.5 h-3 ml-1">
                <span className={`w-0.5 bg-sky-300 rounded-full transition-all duration-300 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
                <span className={`w-0.5 bg-sky-300 rounded-full transition-all duration-300 ${isPlaying ? 'h-2.5 animate-pulse delay-75' : 'h-1'}`} />
                <span className={`w-0.5 bg-sky-300 rounded-full transition-all duration-300 ${isPlaying ? 'h-3.5 animate-pulse delay-150' : 'h-1'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* KHỐI 2 (MOBILE & DESKTOP): CỤM NHÂN VẬT GẤP ĐÔI */}
        <div className="w-full md:w-[50%] flex justify-center md:justify-end items-center relative my-4 md:my-0 order-2">
          <div className="relative w-[420px] sm:w-[500px] md:w-[560px] lg:w-[620px] animate-float-slow">
            <div className="absolute inset-0 bg-yellow-100/50 blur-3xl rounded-full scale-95 -z-10 animate-pulse" />
            <img 
              src="/images/mau.webp" 
              alt="Chúa Giêsu và Thiếu Nhi" 
              className="w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] pointer-events-none"
            />
          </div>
        </div>

        {/* KHỐI 3: CỤM NÚT DÀNH RIÊNG CHO MOBILE (HIỂN THỊ DƯỚI HÌNH ẢNH) */}
        <div className="w-full flex md:hidden flex-col items-center gap-3 order-3 mt-4 pb-4 z-10">
          <button
            onClick={handleScroll}
            className="btn-cartoon-3d text-xl px-10 py-4 shadow-[0_8px_16px_rgba(245,158,11,0.4)] animate-bounce-subtle"
          >
            THAM GIA NGAY!
          </button>

          <button 
            onClick={togglePlay}
            aria-label={isPlaying ? "Dừng nhạc chủ đề" : "Phát nhạc chủ đề"}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-sky-200 text-sky-800 text-xs font-bold shadow-sm transition-all hover:bg-sky-50 active:scale-95 cursor-pointer select-none"
          >
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[10px] font-bold shadow-xs">
              {isPlaying ? '⏸' : '▶'}
            </span>
            <span>{isPlaying ? 'Tạm dừng nhạc' : 'Bật nhạc chủ đề'}</span>
            <div className="flex items-center gap-0.5 h-3 ml-1">
              <span className={`w-0.5 bg-sky-300 rounded-full transition-all duration-300 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
              <span className={`w-0.5 bg-sky-300 rounded-full transition-all duration-300 ${isPlaying ? 'h-2.5 animate-pulse delay-75' : 'h-1'}`} />
              <span className={`w-0.5 bg-sky-300 rounded-full transition-all duration-300 ${isPlaying ? 'h-3.5 animate-pulse delay-150' : 'h-1'}`} />
            </div>
          </button>
        </div>

      </div>

    </div>
  )
}
