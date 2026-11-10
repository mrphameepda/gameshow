import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Play } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function HomeHeroBanner() {
  const { currentUser, userProfile } = useAuth()

  const greetingName = currentUser && userProfile ? userProfile.displayName : 'Bạn Nhỏ'

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white p-6 sm:p-8 md:p-10 shadow-[0_16px_36px_rgba(14,165,233,0.22)] mb-8">
      {/* NỀN MÂY & BONG BÓNG TRANG TRÍ */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-sky-300/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        {/* NỘI DUNG CHÀO MỪNG */}
        <div className="flex-1 text-center md:text-left space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm">
            <Sparkles size={14} className="text-amber-300" />
            <span>Sảnh Game Giáo Lý Công Giáo</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-tight drop-shadow-sm">
            Xin chào, <span className="text-amber-300">{greetingName}</span>! 👋
          </h2>

          <p className="text-sm sm:text-base text-sky-50 font-medium max-w-lg leading-relaxed">
            Học mà chơi, chơi mà lớn lên trong Đức Tin. Cùng Thầy Giêsu chinh phục các chặng đua giáo lý bổ ích ngay hôm nay!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link
              to="/games/rung-chuong-vang"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-blue-600 hover:bg-sky-50 font-black text-sm shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
            >
              <Play size={16} className="fill-blue-600" />
              <span>Chơi Rung Chuông Vàng PRO</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/games/ai-la-trieu-phu"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/30 backdrop-blur-md transition-all"
            >
              <span>Ai Là Triệu Phú</span>
            </Link>
          </div>
        </div>

        {/* MINH HỌA MASCOT */}
        <div className="w-40 sm:w-48 md:w-56 h-40 sm:h-48 md:h-56 flex-shrink-0 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-white/15 rounded-full filter blur-xl transform scale-75 animate-pulse" />
          <img
            src="/images/mascot/jesus-waving-sheet.webp"
            alt="Mascot Thầy Giêsu"
            className="w-full h-full object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  )
}

