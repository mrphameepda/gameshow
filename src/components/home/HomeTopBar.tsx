import { Search, Flame, Coins, Menu, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getAvatarByName } from '@/utils/avatarHelper'
import { Link, useNavigate } from 'react-router-dom'

interface HomeTopBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onOpenMobileMenu: () => void
}

export function HomeTopBar({ searchTerm, onSearchChange, onOpenMobileMenu }: HomeTopBarProps) {
  const { currentUser, userProfile, setShowAuthModal } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="w-full flex items-center justify-between gap-3 mb-6">
      {/* MOBILE MENU BUTTON & LOGO ICON */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-slate-700 hover:bg-slate-50 transition-colors"
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-lg font-black shadow-sm">
            ✝
          </div>
          <span className="font-display font-black text-sky-900 text-sm hidden sm:inline">
            VUI HỌC
          </span>
        </Link>
      </div>

      {/* SEARCH BAR (PILL SOFT UI) */}
      <div className="flex-1 max-w-xl relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm minigame, chủ đề giáo lý..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-sky-100 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all"
        />
      </div>

      {/* STATS PILLS (STREAK, COINS, POINTS) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {currentUser && userProfile ? (
          <>
            {/* STREAK */}
            <div 
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-orange-100 shadow-sm text-orange-600 font-extrabold text-xs"
              title="Chuỗi ngày điểm danh đọc Lời Chúa"
            >
              <Flame size={16} className="text-orange-500 fill-orange-500" />
              <span>{userProfile.dailyCheckIn?.checkInCount || 1}</span>
            </div>

            {/* COINS */}
            <div 
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-amber-100 shadow-sm text-amber-600 font-extrabold text-xs"
              title="Xu vàng của bạn"
            >
              <Coins size={16} className="text-amber-500" />
              <span className="hidden sm:inline">{userProfile.coins || 0}</span>
            </div>

            {/* AVATAR LINK TO USER DASHBOARD */}
            <button
              onClick={() => navigate('/dashboard')}
              title="Vào Trang cá nhân (Dashboard)"
              className="relative p-0.5 rounded-full ring-2 ring-sky-400 hover:ring-sky-500 transition-all hover:scale-105 active:scale-95"
            >
              <img
                src={userProfile.avatarUrl || getAvatarByName(userProfile.displayName || '')}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover bg-white"
              />
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 transition-all active:scale-95"
          >
            <User size={14} />
            <span className="hidden sm:inline">Đăng Nhập</span>
          </button>
        )}
      </div>
    </div>
  )
}
