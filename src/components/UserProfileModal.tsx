// src/components/UserProfileModal.tsx
import { X, Trophy, Settings, LogOut, Save, Lock, User, Church, MapPin, Star, Gamepad2, Heart, MessageSquare, Send, Coins, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { UserProfile, GameScore, GuestbookEntry } from '@/types/user'
import { AVAILABLE_AVATARS, getAvatarByName } from '@/utils/avatarHelper'
import { useEffect, useState } from 'react'
import { get, ref, push, update } from 'firebase/database'
import { rtdb } from '@/config/firebase'
export default function UserProfileModal() {
  const { showProfileModal, setShowProfileModal, userProfile, currentUser, logout, updateProfile, changePassword, viewingUserId, viewingUserName, setViewingUser, equipRoomItem } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'decor'>('overview')
  const [editName, setEditName] = useState('')
  const [editParish, setEditParish] = useState('')
  const [editDiocese, setEditDiocese] = useState('')
  const [editAvatar, setEditAvatar] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null)
  const [guestMessage, setGuestMessage] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [showHeartAnim, setShowHeartAnim] = useState(false)
  useEffect(() => {
    if (viewingUserId) {
      get(ref(rtdb, `users/${viewingUserId}`)).then(snap => {
        if (snap.exists()) setViewedProfile(snap.val())
      })
    } else {
      setViewedProfile(null)
    }
  }, [viewingUserId])

  const activeProfile = viewingUserId ? viewedProfile : userProfile;

  if (!showProfileModal || (!userProfile && !viewingUserId) || (viewingUserId && !viewedProfile)) return null

  // Initialize form fields on first render
  if (!isInitialized) {
    setEditName(activeProfile?.displayName || '')
    setEditParish(activeProfile?.parish || '')
    setEditDiocese(activeProfile?.diocese || '')
    setEditAvatar(activeProfile?.avatarUrl || getAvatarByName(activeProfile?.displayName || ''))
    setIsInitialized(true)
  }

  const close = () => {
    setShowProfileModal(false)
    setIsInitialized(false)
    setProfileMsg('')
    setPasswordMsg('')
    setConfirmPassword('')
    if (setViewingUser) setViewingUser(null, null)
  }

  const handleSaveProfile = async () => {
    if (!editName.trim()) { setProfileMsg('❌ Tên hiển thị không được để trống'); return }
    setSavingProfile(true)
    try {
      await updateProfile({ displayName: editName, parish: editParish, diocese: editDiocese, avatarUrl: editAvatar })
      setProfileMsg('✅ Đã cập nhật thành công!')
    } catch {
      setProfileMsg('❌ Lỗi khi cập nhật')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { setPasswordMsg('❌ Mật khẩu phải có ít nhất 6 ký tự'); return }
    if (newPassword !== confirmPassword) { setPasswordMsg('❌ Mật khẩu xác nhận không khớp'); return }
    setSavingPassword(true)
    try {
      await changePassword(newPassword)
      setPasswordMsg('✅ Đổi mật khẩu thành công!')
      setNewPassword(''); setConfirmPassword('')
    } catch {
      setPasswordMsg('❌ Lỗi: Có thể bạn cần đăng nhập lại trước khi đổi mật khẩu')
    } finally {
      setSavingPassword(false)
    }
  }

  const gameScoreEntries = Object.entries(activeProfile?.gameScores || {})
  const maxBestScore = gameScoreEntries.length > 0 ? Math.max(...gameScoreEntries.map(([, v]) => (v as GameScore).bestScore || 0)) : 1

  const handleLike = async () => {
    if (!viewingUserId || !currentUser) return;
    try {
      setShowHeartAnim(true)
      await update(ref(rtdb, `users/${viewingUserId}/likes`), {
        [currentUser.uid]: true
      })
      setTimeout(() => setShowHeartAnim(false), 1000)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSendMsg = async () => {
    if (!viewingUserId || !currentUser || !guestMessage.trim() || guestMessage.length > 50) return;
    setSendingMsg(true)
    try {
      await push(ref(rtdb, `users/${viewingUserId}/guestbook`), {
        senderName: userProfile?.displayName || 'Khách',
        senderUid: currentUser.uid,
        text: guestMessage.trim(),
        timestamp: Date.now()
      })
      setGuestMessage('')
    } catch (e) {
      console.error(e)
    } finally {
      setSendingMsg(false)
    }
  }

  // Lọc 3 lời chúc mới nhất
  const guestbookEntries = Object.entries(activeProfile?.guestbook || {})
    .sort(([, a], [, b]) => ((b as GuestbookEntry).timestamp || 0) - ((a as GuestbookEntry).timestamp || 0))
    .slice(0, 3)
  
  const hasLiked = viewingUserId && currentUser && activeProfile?.likes?.[currentUser.uid]
  const likesCount = Object.keys(activeProfile?.likes || {}).length

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={close}>
      <div
        className="relative w-full max-w-lg max-h-[90vh] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={close} className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>

        {viewingUserId && (
          <div className="bg-amber-100 text-amber-800 p-3 text-center text-sm font-bold animate-pulse">
            👀 Con đang ghé thăm nhà của {viewingUserName}
            <button 
              onClick={() => { setViewingUser(null, null); close(); }}
              className="ml-4 px-3 py-1 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors shadow-sm"
            >
              ⬅️ Trở về
            </button>
          </div>
        )}

        {/* User Hero - Room Layout */}
        <div className="relative px-8 pt-8 pb-4 text-center min-h-[250px] flex flex-col items-center justify-center overflow-hidden bg-sky-50 border-b border-sky-100">
          
          {/* Decor Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {activeProfile?.roomLayout?.['carpet'] && (
               <img src={`/assets/room/${activeProfile.roomLayout['carpet']}.png`} className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 opacity-80 mix-blend-multiply" />
            )}
            {activeProfile?.roomLayout?.['table'] && (
               <img src={`/assets/room/${activeProfile.roomLayout['table']}.png`} className="absolute bottom-2 left-4 w-32 drop-shadow-xl" />
            )}
            {activeProfile?.roomLayout?.['bookshelf'] && (
               <img src={`/assets/room/${activeProfile.roomLayout['bookshelf']}.png`} className="absolute bottom-8 right-6 w-28 drop-shadow-xl" />
            )}
          </div>

          <div className="relative z-10 w-full">
            <div className="mx-auto w-24 h-24 rounded-full mb-3 shadow-lg flex items-center justify-center overflow-hidden bg-white ring-4 ring-amber-400">
              <img 
                src={activeProfile?.avatarUrl || getAvatarByName(activeProfile?.displayName || '')} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-display text-2xl font-black text-slate-800 drop-shadow-sm">{activeProfile?.displayName}</h2>
            <p className="text-sm font-bold text-sky-700">{[activeProfile?.parish, activeProfile?.diocese].filter(Boolean).join(', ') || 'Chưa cập nhật thông tin'}</p>
            
            {/* Badges Display (Top 3) */}
            <div className="flex justify-center gap-2 mt-3">
               {Object.keys(activeProfile?.badges || {}).slice(0, 3).map(bId => (
                 <img key={bId} src={`/assets/badges/${bId}.png`} className="w-10 h-10 object-contain drop-shadow-md" title="Danh hiệu" />
               ))}
            </div>

            {/* Total Score & Coins Card */}
            <div className="mt-4 inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/90 backdrop-blur shadow-lg shadow-sky-200/50 border-2 border-sky-100">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-amber-500" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Điểm</div>
                  <div className="text-xl font-black text-slate-700 -mt-1">{activeProfile?.totalScore?.toLocaleString() || '0'}</div>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <Coins size={20} className="text-amber-400" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Xu</div>
                  <div className="text-xl font-black text-slate-700 -mt-1">{activeProfile?.coins?.toLocaleString() || '0'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Star size={14} className="inline mr-1.5" /> Thành Tích
          </button>
          {!viewingUserId && (
            <>
              <button
                onClick={() => setActiveTab('decor')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'decor' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <Sparkles size={14} className="inline mr-1.5" /> Trang Trí
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <Settings size={14} className="inline mr-1.5" /> Cài Đặt
              </button>
            </>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              {/* Vùng Tương Tác: Thả Tim & Lưu Bút (Chỉ hiện khi đi thăm) */}
              {viewingUserId && (
                <div className="bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-100 rounded-3xl p-5 mb-4 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-pink-500 flex items-center gap-2">
                      <Heart size={18} className="text-pink-400" />
                      Góc Gắn Kết
                    </h3>
                    <button
                      onClick={handleLike}
                      disabled={Boolean(hasLiked)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 ${
                        hasLiked 
                        ? 'bg-pink-100 text-pink-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white'
                      }`}
                    >
                      {hasLiked ? 'Đã thích 👍' : 'Thích Phòng ❤️'}
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{likesCount}</span>
                      {showHeartAnim && (
                        <Heart className="absolute -top-6 left-1/2 -translate-x-1/2 text-pink-500 animate-ping" fill="currentColor" size={24} />
                      )}
                    </button>
                  </div>

                  {/* Nhập Lời Chúc */}
                  <div className="flex gap-2 relative">
                    <MessageSquare size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-300" />
                    <input
                      type="text"
                      maxLength={50}
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      placeholder="Gửi lời chúc tới bạn (max 50 ký tự)..."
                      className="flex-1 bg-white border border-pink-200 rounded-full py-2.5 pl-9 pr-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                    />
                    <button
                      onClick={handleSendMsg}
                      disabled={!guestMessage.trim() || sendingMsg}
                      className="w-10 h-10 shrink-0 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <Send size={16} className="ml-[-2px]" />
                    </button>
                  </div>

                  {/* Danh sách 3 Lời Chúc Mới Nhất */}
                  {guestbookEntries.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-pink-200/50 space-y-2">
                      {guestbookEntries.map(([msgId, msg]: [string, any]) => (
                        <div key={msgId} className="bg-yellow-100/80 p-3 rounded-xl border border-yellow-200 shadow-sm relative">
                          <div className="w-2 h-2 rounded-full bg-red-400 absolute -top-1 left-4 shadow-sm" />
                          <p className="text-xs font-bold text-slate-800 mb-1">{msg.text}</p>
                          <p className="text-[10px] text-slate-500 text-right">- {msg.senderName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {gameScoreEntries.length === 0 ? (
                <div className="text-center py-10">
                  <Gamepad2 size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-400 font-bold text-sm">Bạn chưa chơi game nào.</p>
                  <p className="text-slate-400 text-xs mt-1">Hãy bắt đầu chơi để tích lũy thành tích!</p>
                </div>
              ) : (
                gameScoreEntries.map(([gameId, data]: [string, any]) => (
                  <div key={gameId} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-700 truncate max-w-[60%]">
                        {(data as { gameName?: string }).gameName || gameId}
                      </span>
                      <span className="font-black text-lg text-amber-600">{data.bestScore}</span>
                    </div>
                    {/* Score bar */}
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-700"
                        style={{ width: `${Math.min((data.bestScore / maxBestScore) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-semibold">
                      <span>Chơi {data.playCount} lần</span>
                      <span>{new Date(data.lastPlayed).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'decor' && !viewingUserId && (
            <div className="space-y-6">
              <h3 className="font-bold text-slate-600 mb-3">Kho Nội Thất Của Bạn</h3>
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-4 text-sm text-amber-800">
                💡 Bấm vào một món đồ bên dưới để <strong>TRANG BỊ</strong> hoặc <strong>CẤT ĐI</strong>.
              </div>

              {Object.keys(activeProfile?.inventory || {}).length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 font-bold">Bạn chưa có nội thất nào!</p>
                  <p className="text-slate-400 text-xs mt-1">Hãy ghé thăm Cửa Hàng để sắm sửa nhé.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {Object.keys(activeProfile?.inventory || {}).map(itemId => {
                    const isEquipped = Object.values(activeProfile?.roomLayout || {}).includes(itemId);
                    // Determine slot based on itemId
                    let slotId = 'table';
                    if (itemId.includes('bookshelf')) slotId = 'bookshelf';
                    if (itemId.includes('carpet')) slotId = 'carpet';

                    return (
                      <div 
                        key={itemId}
                        onClick={() => equipRoomItem(slotId, isEquipped ? null : itemId)}
                        className={`relative rounded-2xl p-2 cursor-pointer transition-all border-2
                          ${isEquipped ? 'border-amber-400 bg-amber-50 shadow-md transform scale-105' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                      >
                        <img src={`/assets/room/${itemId}.png`} className="w-full h-16 object-contain drop-shadow-sm mb-2" />
                        <div className="text-center text-[10px] font-bold text-slate-600 truncate px-1">
                          {isEquipped ? 'ĐANG DÙNG' : 'CHỌN'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Profile Form */}
              <div>
                <h3 className="font-bold text-sm text-slate-600 mb-3">Thông tin cá nhân</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text" value={editName} onChange={e => setEditName(e.target.value)} maxLength={25}
                      placeholder="Tên hiển thị *"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Church size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text" value={editParish} onChange={e => setEditParish(e.target.value)} maxLength={30}
                      placeholder="Giáo xứ"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text" value={editDiocese} onChange={e => setEditDiocese(e.target.value)} maxLength={30}
                      placeholder="Giáo phận"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-xs font-bold text-slate-500 mb-3 text-center">Đổi ảnh đại diện Chibi:</p>
                    <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
                      {AVAILABLE_AVATARS.map((avatar, idx) => (
                        <img
                          key={idx}
                          src={avatar}
                          alt="Avatar"
                          onClick={() => setEditAvatar(avatar)}
                          className={`w-10 h-10 rounded-full cursor-pointer transition-transform ${editAvatar === avatar ? 'ring-2 ring-blue-500 scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {profileMsg && <p className="mt-2 text-xs font-bold text-center">{profileMsg}</p>}
                <button
                  onClick={handleSaveProfile} disabled={savingProfile}
                  className="mt-3 w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-md active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={16} /> {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>

              {/* Password Form */}
              <div>
                <h3 className="font-bold text-sm text-slate-600 mb-3">Đổi mật khẩu</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6}
                      placeholder="Mật khẩu mới"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={6}
                      placeholder="Xác nhận mật khẩu mới"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-base font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                </div>
                {passwordMsg && <p className="mt-2 text-xs font-bold text-center">{passwordMsg}</p>}
                <button
                  onClick={handleChangePassword} disabled={savingPassword}
                  className="mt-3 w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-sm shadow-md active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock size={16} /> {savingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm border border-red-200 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
