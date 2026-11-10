// src/components/GuestSaveScorePopup.tsx
import { X, UserPlus, SkipForward } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Props {
  score: number
  gameId: string
  gameName: string
  onClose: () => void
}

export default function GuestSaveScorePopup({ score, gameId, gameName, onClose }: Props) {
  const { currentUser, setPendingScore, setShowAuthModal } = useAuth()

  // Don't show if already logged in
  if (currentUser) return null

  const handleSignup = () => {
    setPendingScore({ gameId, gameName, score })
    onClose()
    setShowAuthModal(true)
  }

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-sm bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={18} />
        </button>

        <div className="px-8 py-8 text-center">
          {/* Score highlight */}
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-orange-500/30">
            <span className="text-3xl font-black text-white">{score}</span>
          </div>

          <h3 className="font-display text-xl font-black text-slate-800 mb-2">
            Tuyệt vời! 🎉
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Bạn vừa đạt <strong className="text-amber-600">{score} điểm</strong> trong <strong>{gameName}</strong>!
            <br />Đăng nhập hoặc Đăng ký để tích lũy điểm vào Bảng Xếp Hạng Tổng của toàn hệ thống nhé!
          </p>

          <button
            onClick={handleSignup}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-3"
          >
            <UserPlus size={18} /> Đăng ký / Đăng nhập ngay
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm text-slate-400 hover:text-slate-600 font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <SkipForward size={14} /> Bỏ qua, tôi chỉ muốn chơi thử
          </button>
        </div>
      </div>
    </div>
  )
}
