import { Link, useLocation } from 'react-router-dom'
import { LogIn, Trophy, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { getAvatarByName } from '@/utils/avatarHelper'

export default function Header() {
  const { currentUser, userProfile, loading, setShowAuthModal } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Giới Thiệu', path: '/gioi-thieu' },
    { name: 'Liên Hệ', path: '/lien-he' },
    { name: 'Chính Sách', path: '/chinh-sach' },
  ]

  return (
    <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-6xl z-50 transition-all duration-300 bg-white/90 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 shadow-[0_8px_24px_rgba(14,165,233,0.15)] text-slate-800 border-2 border-white">
      <div className="flex items-center justify-between h-12">
        
        {/* LÔ GÔ VÀ TIÊU ĐỀ */}
        <Link to="/" className="flex flex-col justify-center min-w-0 mr-2">
          <h1 className="font-display font-black text-base sm:text-xl text-blue-700 drop-shadow-sm truncate">
            VUI HỌC CÙNG THẦY GIÊSU
          </h1>
          <span className="text-[8px] sm:text-[10px] font-bold text-blue-500 uppercase tracking-widest -mt-1 truncate">
            Vericath Games
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-bold transition-all ${
                location.pathname === link.path 
                  ? 'text-blue-700 font-extrabold' 
                  : 'text-slate-800 hover:text-blue-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* NÚT TÀI KHOẢN VÀ MOBILE MENU */}
        <div className="flex items-center gap-3">
          {/* Tài khoản */}
          {!loading && (
            currentUser && userProfile ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-sky-100 shadow-sm hover:bg-white/90 transition-all active:scale-95"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm overflow-hidden bg-white ring-2 ring-amber-400">
                  <img src={userProfile.avatarUrl || getAvatarByName(userProfile.displayName)} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-black text-slate-700 truncate max-w-[120px]">{userProfile.displayName}</div>
                  <div className="flex items-center gap-1 -mt-0.5">
                    <Trophy size={10} className="text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-600">{userProfile.totalScore.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 sm:px-6 py-2 shadow-md hover:shadow-lg transition-transform active:scale-95 flex items-center gap-2 text-sm"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )
          )}

          {/* Nút Hamburger Mobile */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE DROP DOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-lg px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-medium py-2 px-4 rounded-xl ${
                location.pathname === link.path 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
