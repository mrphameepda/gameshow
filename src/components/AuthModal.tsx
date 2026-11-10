// src/components/AuthModal.tsx
import { useState } from 'react'
import { X, Lock, User, Church, MapPin } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import JesusMascot from './JesusMascot'
import { AVAILABLE_AVATARS, getRandomAvatar } from '@/utils/avatarHelper'

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, register, pendingScore } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [parish, setParish] = useState('')
  const [diocese, setDiocese] = useState('')
  const [error, setError] = useState('')
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState('')

  if (!showAuthModal) return null

  const resetForm = () => {
    setUsername(''); setPassword(''); setDisplayName(''); setParish(''); setDiocese('')
    setError(''); setSuggestedUsernames([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuggestedUsernames([])
    setIsLoading(true)

    try {
      if (mode === 'login') {
        await login(username, password)
      } else {
        if (!displayName.trim()) { setError('Vui lòng nhập tên hiển thị'); setIsLoading(false); return }
        const finalAvatar = selectedAvatar || getRandomAvatar();
        await register(username, password, { displayName, parish, diocese, avatarUrl: finalAvatar })
      }
      resetForm()
      setShowAuthModal(false)
    } catch (err: unknown) {
      const authErr = err as { code?: string; suggestions?: string[] }
      if (authErr.code === 'username-already-in-use') {
        setError('Tên đăng nhập này đã có người sử dụng.')
        setSuggestedUsernames(authErr.suggestions || [])
      } else {
        const firebaseErr = authErr
        const errMap: Record<string, string> = {
          'auth/user-not-found': 'Không tìm thấy tài khoản',
          'auth/wrong-password': 'Mật khẩu không đúng',
          'auth/invalid-credential': 'Tên đăng nhập hoặc mật khẩu không đúng',
          'auth/weak-password': 'Mật khẩu phải có ít nhất 6 ký tự'
        }
        console.error("LỖI ĐĂNG KÝ/ĐĂNG NHẬP:", err);
        setError(errMap[firebaseErr.code || ''] || 'Đã xảy ra lỗi. Vui lòng thử lại.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const close = () => { setShowAuthModal(false); resetForm() }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={close}>
      <div
        className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={close} className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="mx-auto flex justify-center mb-2">
            <JesusMascot className="w-24 h-24 drop-shadow-xl" />
          </div>
          <h2 className="font-display text-2xl font-black text-slate-800">
            {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'login' ? 'Đăng nhập để lưu kỷ lục và xếp hạng' : 'Tạo tài khoản để tích lũy thành tích'}
          </p>
          {pendingScore && (
            <div className="mt-3 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
              🎯 Đang chờ lưu {pendingScore.score} điểm từ {pendingScore.gameName}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold text-center">
              {error}
              {suggestedUsernames.length > 0 && (
                <div className="mt-2 text-xs font-normal">
                  Bạn có thể thử:
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {suggestedUsernames.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setUsername(s); setError(''); setSuggestedUsernames([]) }}
                        className="px-3 py-1 bg-white border border-red-200 rounded-full hover:bg-red-100 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)} required
              placeholder="Tên đăng nhập (viết liền không dấu)"
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              placeholder="Mật khẩu (ít nhất 6 ký tự)"
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={25} required
                  placeholder="Tên hiển thị *"
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <Church size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" value={parish} onChange={e => setParish(e.target.value)} maxLength={30}
                  placeholder="Giáo xứ (tùy chọn)"
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={diocese} onChange={e => setDiocese(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all appearance-none"
                >
                  <option value="">-- Chọn Giáo phận --</option>
                  <optgroup label="Tổng Giáo phận Hà Nội">
                      <option value="Hà Nội">Tổng Giáo phận Hà Nội</option>
                      <option value="Bắc Ninh">Giáo phận Bắc Ninh</option>
                      <option value="Bùi Chu">Giáo phận Bùi Chu</option>
                      <option value="Hà Tĩnh">Giáo phận Hà Tĩnh</option>
                      <option value="Hải Phòng">Giáo phận Hải Phòng</option>
                      <option value="Hưng Hóa">Giáo phận Hưng Hóa</option>
                      <option value="Lạng Sơn - Cao Bằng">Giáo phận Lạng Sơn - Cao Bằng</option>
                      <option value="Phát Diệm">Giáo phận Phát Diệm</option>
                      <option value="Thái Bình">Giáo phận Thái Bình</option>
                      <option value="Vinh">Giáo phận Vinh</option>
                  </optgroup>
                  <optgroup label="Tổng Giáo phận Huế">
                      <option value="Huế">Tổng Giáo phận Huế</option>
                      <option value="Đà Nẵng">Giáo phận Đà Nẵng</option>
                      <option value="Qui Nhơn">Giáo phận Qui Nhơn</option>
                      <option value="Kontum">Giáo phận Kontum</option>
                      <option value="Nha Trang">Giáo phận Nha Trang</option>
                      <option value="Ban Mê Thuột">Giáo phận Ban Mê Thuột</option>
                  </optgroup>
                  <optgroup label="Tổng Giáo phận Sài Gòn">
                      <option value="Sài Gòn">Tổng Giáo phận Sài Gòn</option>
                      <option value="Đà Lạt">Giáo phận Đà Lạt</option>
                      <option value="Phan Thiết">Giáo phận Phan Thiết</option>
                      <option value="Phú Cường">Giáo phận Phú Cường</option>
                      <option value="Xuân Lộc">Giáo phận Xuân Lộc</option>
                      <option value="Bà Rịa">Giáo phận Bà Rịa</option>
                      <option value="Mỹ Tho">Giáo phận Mỹ Tho</option>
                      <option value="Vĩnh Long">Giáo phận Vĩnh Long</option>
                      <option value="Long Xuyên">Giáo phận Long Xuyên</option>
                      <option value="Cần Thơ">Giáo phận Cần Thơ</option>
                  </optgroup>
                  <option value="Khác">Khác...</option>
                </select>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold text-slate-500 mb-3 text-center">Chọn ảnh đại diện Chibi của bạn:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {AVAILABLE_AVATARS.map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar}
                      alt="Avatar"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-12 h-12 rounded-full cursor-pointer transition-transform ${selectedAvatar === avatar ? 'ring-4 ring-amber-400 scale-105' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit" disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? '⏳ Đang xử lý...' : mode === 'login' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}
          </button>

          <div className="text-center text-sm">
            <span className="text-slate-500">
              {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
