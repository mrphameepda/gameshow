// src/components/UserHeaderBar.tsx
import { LogIn, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function UserHeaderBar() {
  const { currentUser, userProfile, loading, setShowAuthModal, setShowProfileModal } = useAuth()

  if (loading) return null

  return (
    <div className="flex items-center justify-end gap-2 py-3 px-4 max-w-5xl mx-auto">
      {currentUser && userProfile ? (
        <button
          onClick={() => setShowProfileModal(true)}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:bg-white/90 transition-all active:scale-95"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
            {(userProfile.displayName || '?')[0].toUpperCase()}
          </div>
          <div className="text-left">
            <div className="text-xs font-black text-slate-700 truncate max-w-[120px]">{userProfile.displayName}</div>
            <div className="flex items-center gap-1 -mt-0.5">
              <Trophy size={10} className="text-amber-500" />
              <span className="text-[10px] font-bold text-amber-600">{userProfile.totalScore.toLocaleString()} điểm</span>
            </div>
          </div>
        </button>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
        >
          <LogIn size={16} />
          Đăng nhập
        </button>
      )}
    </div>
  )
}
