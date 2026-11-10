import { useAuth } from '@/contexts/AuthContext'
import { getAvatarByName } from '@/utils/avatarHelper'
import { Settings, Sparkles } from 'lucide-react'

export function UserRoomWidget() {
  const { userProfile, setShowProfileModal } = useAuth();

  if (!userProfile) return null;

  return (
    <div className="bg-white/95 rounded-[32px] border-2 border-white shadow-[0_12px_24px_rgba(14,165,233,0.15)] w-full overflow-hidden flex flex-col relative mb-10">
      {/* Settings Button */}
      <button 
        onClick={() => setShowProfileModal(true)}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-sky-100 text-sky-600 transition-colors shadow-sm backdrop-blur-sm"
      >
        <Settings size={18} />
      </button>

      {/* Room Decor Area */}
      <div className="relative w-full h-48 bg-sky-50 border-b border-sky-100 flex items-center justify-center overflow-hidden">
        {/* Decor Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {userProfile?.roomLayout?.['carpet'] && (
            <img src={`/assets/room/${userProfile.roomLayout['carpet']}.png`} className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 opacity-80 mix-blend-multiply" />
          )}
          {userProfile?.roomLayout?.['table'] && (
            <img src={`/assets/room/${userProfile.roomLayout['table']}.png`} className="absolute bottom-0 left-2 w-24 drop-shadow-xl" />
          )}
          {userProfile?.roomLayout?.['bookshelf'] && (
            <img src={`/assets/room/${userProfile.roomLayout['bookshelf']}.png`} className="absolute bottom-4 right-2 w-20 drop-shadow-xl" />
          )}
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full shadow-lg overflow-hidden bg-white ring-4 ring-amber-400 mb-2">
            <img 
              src={userProfile?.avatarUrl || getAvatarByName(userProfile?.displayName)} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-display font-black text-slate-800 drop-shadow-sm text-lg">
            {userProfile?.displayName}
          </h3>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 bg-white z-10">
        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3">
          <div className="text-center flex-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Điểm</div>
            <div className="text-lg font-black text-sky-600 -mt-1">{userProfile?.totalScore?.toLocaleString() || '0'}</div>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="text-center flex-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Xu Vàng</div>
            <div className="text-lg font-black text-amber-500 -mt-1">{userProfile?.coins?.toLocaleString() || '0'}</div>
          </div>
        </div>

        <button 
          onClick={() => setShowProfileModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
        >
          <Sparkles size={16} /> Trang Trí Căn Phòng
        </button>
      </div>
    </div>
  )
}
