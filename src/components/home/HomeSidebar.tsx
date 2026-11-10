import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  BookOpen, 
  Info, 
  User as UserIcon, 
  Settings, 
  Coins, 
  ChevronRight
} from 'lucide-react'
import { getAvatarByName } from '@/utils/avatarHelper'
import type { GameCategory } from '@/config/gamesList'

interface HomeSidebarProps {
  activeCategory: 'TẤT CẢ' | GameCategory
  onSelectCategory: (category: 'TẤT CẢ' | GameCategory) => void
  onScrollToStickers?: () => void
  onCloseMobile?: () => void
}

export function HomeSidebar({
  activeCategory,
  onSelectCategory,
  onScrollToStickers,
  onCloseMobile
}: HomeSidebarProps) {
  const { currentUser, userProfile, setShowAuthModal, setShowProfileModal } = useAuth()
  const navigate = useNavigate()

  const handleNavClick = (action: () => void) => {
    action()
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <aside className="w-full flex flex-col justify-between bg-white rounded-[32px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sky-100/70 min-h-[calc(100vh-48px)] sticky top-6">
      <div className="flex flex-col gap-6">
        {/* BRAND LOGO SẢNH GAME */}
        <Link 
          to="/" 
          className="flex items-center gap-3.5 px-2 py-1 group transition-transform active:scale-95"
          onClick={() => handleNavClick(() => onSelectCategory('TẤT CẢ'))}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            ✝
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-black text-sky-900 text-base leading-tight tracking-tight truncate">
              VUI HỌC CÙNG CHÚA
            </h1>
            <p className="text-[10px] text-amber-500 font-extrabold tracking-wider uppercase truncate">
              Sảnh Game Công Giáo
            </p>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex flex-col gap-1.5">
          <p className="px-3 text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Khám phá Sảnh Game
          </p>

          <button
            onClick={() => handleNavClick(() => onSelectCategory('TẤT CẢ'))}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeCategory === 'TẤT CẢ'
                ? 'bg-sky-50 text-sky-600 shadow-sm border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <Gamepad2 size={18} className={activeCategory === 'TẤT CẢ' ? 'text-sky-500' : 'text-slate-400'} />
              <span>Tất cả Minigames</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100/70 text-sky-700 font-black">
              10
            </span>
          </button>

          <button
            onClick={() => handleNavClick(() => onSelectCategory('ĐUA TOP'))}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeCategory === 'ĐUA TOP'
                ? 'bg-sky-50 text-sky-600 shadow-sm border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600'
            }`}
          >
            <Trophy size={18} className={activeCategory === 'ĐUA TOP' ? 'text-amber-500' : 'text-slate-400'} />
            <span>Trí Tuệ & Đua Top</span>
          </button>

          <button
            onClick={() => handleNavClick(() => onSelectCategory('SINH HOẠT'))}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeCategory === 'SINH HOẠT'
                ? 'bg-sky-50 text-sky-600 shadow-sm border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600'
            }`}
          >
            <Sparkles size={18} className={activeCategory === 'SINH HOẠT' ? 'text-rose-500' : 'text-slate-400'} />
            <span>Sinh Hoạt Tập Thể</span>
          </button>

          <button
            onClick={() => handleNavClick(() => onSelectCategory('CÔNG CỤ'))}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeCategory === 'CÔNG CỤ'
                ? 'bg-sky-50 text-sky-600 shadow-sm border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600'
            }`}
          >
            <BookOpen size={18} className={activeCategory === 'CÔNG CỤ' ? 'text-emerald-500' : 'text-slate-400'} />
            <span>Công Cụ Giáo Lý</span>
          </button>

          {onScrollToStickers && (
            <button
              onClick={() => handleNavClick(onScrollToStickers)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-all"
            >
              <Sparkles size={18} className="text-purple-500" />
              <span>Sổ Sticker Đức Tin</span>
            </button>
          )}

          <Link
            to="/gioi-thieu"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-all"
            onClick={() => onCloseMobile?.()}
          >
            <Info size={18} className="text-slate-400" />
            <span>Về Dự Án Mục Vụ</span>
          </Link>
        </div>

        {/* THÔNG ĐIỆP MỤC VỤ (SOFT PRO CARD) */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/60 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">✨</span>
            <p className="font-extrabold text-xs text-amber-900">Lời Chúa Mỗi Ngày</p>
          </div>
          <p className="text-[11px] text-amber-800/80 font-medium leading-relaxed italic">
            "Thầy là đường, là sự thật và là sự sống."
          </p>
        </div>
      </div>

      {/* QUICK ACCOUNT / ACCESS TO USER DASHBOARD */}
      <div className="pt-4 mt-6 border-t border-slate-100">
        {currentUser && userProfile ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50/80 border border-slate-100">
              <img
                src={userProfile.avatarUrl || getAvatarByName(userProfile.displayName || '')}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 bg-white flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-xs text-slate-800 truncate">
                  {userProfile.displayName}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                  <span className="text-amber-500 flex items-center gap-0.5">
                    <Coins size={11} /> {userProfile.coins || 0}
                  </span>
                  <span>•</span>
                  <span className="text-sky-600">
                    {userProfile.totalScore || 0} đ
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                title="Cài đặt tài khoản"
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Settings size={15} />
              </button>
            </div>

            {/* NÚT VÀO RIÊNG USER DASHBOARD */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition-all active:scale-95"
            >
              <div className="flex items-center gap-2">
                <UserIcon size={14} />
                <span>Vào Trang Cá Nhân</span>
              </div>
              <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-center">
              <p className="text-xs font-bold text-sky-900 mb-1">Tham gia cùng cộng đoàn</p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Lưu điểm số và nhận huy hiệu danh dự
              </p>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs shadow-md shadow-sky-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <UserIcon size={14} />
              <span>Đăng Nhập / Đăng Ký</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
