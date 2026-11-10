import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Trophy, Mail, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { LeaderboardModal } from './LeaderboardModal'
import { getAvatarByName } from '@/utils/avatarHelper'

export function MobileBottomToolbar() {
  const location = useLocation()
  const { currentUser, userProfile, setShowAuthModal } = useAuth()
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)

  // Ẩn thanh bottom toolbar khi đang ở màn hình chơi game để tránh che nút bấm
  const isPlayingGame = location.pathname.startsWith('/games')
  if (isPlayingGame) return null

  const isHome = location.pathname === '/'
  const isContact = location.pathname === '/lien-he'
  const isDashboard = location.pathname === '/dashboard'

  return (
    <>
      <nav 
        aria-label="Thanh điều hướng dưới cùng"
        className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-md z-40 bg-white/90 backdrop-blur-xl border border-white/80 rounded-full px-3 py-1.5 shadow-[0_10px_30px_rgba(14,165,233,0.18)]"
      >
        <div className="flex items-center justify-around">
          {/* 1. TRANG CHỦ */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
              isHome ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-blue-500 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${isHome ? 'bg-blue-50 text-blue-600' : ''}`}>
              <Home size={20} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Trang chủ</span>
          </Link>

          {/* 2. BẢNG XẾP HẠNG (POPUP MODAL) */}
          <button
            type="button"
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-500 hover:text-amber-500 font-medium transition-all duration-200 active:scale-95"
          >
            <div className="p-1 rounded-xl hover:bg-amber-50 transition-colors text-amber-500">
              <Trophy size={20} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Xếp hạng</span>
          </button>

          {/* 3. LIÊN HỆ */}
          <Link
            to="/lien-he"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
              isContact ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-blue-500 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${isContact ? 'bg-blue-50 text-blue-600' : ''}`}>
              <Mail size={20} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Liên hệ</span>
          </Link>

          {/* 4. ĐĂNG NHẬP HOẶC TÀI KHOẢN */}
          {currentUser && userProfile ? (
            <Link
              to="/dashboard"
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                isDashboard ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-blue-500 font-medium'
              }`}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-amber-400 bg-white">
                <img
                  src={userProfile.avatarUrl || getAvatarByName(userProfile.displayName || '')}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[54px]">
                {userProfile.displayName || 'Tôi'}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-500 hover:text-blue-600 font-medium transition-all duration-200 active:scale-95"
            >
              <div className="p-1 rounded-xl hover:bg-sky-50 transition-colors text-sky-600">
                <LogIn size={20} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Đăng nhập</span>
            </button>
          )}
        </div>
      </nav>

      {/* MODAL BẢNG XẾP HẠNG POPUP */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </>
  )
}
