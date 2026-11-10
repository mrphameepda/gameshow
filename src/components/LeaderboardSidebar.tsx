import { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { rtdb } from '@/config/firebase'
import { Trophy, ChevronDown, ChevronUp, Home } from 'lucide-react'
import { getAvatarByName } from '@/utils/avatarHelper'
import { useAuth } from '@/contexts/AuthContext'

export interface TopUser {
  id: string
  saintName?: string
  fullName: string
  avatarUrl?: string
  totalScore: number
}

export const formatPlayerName = (fullName: string): string => {
  if (!fullName) return 'Người chơi';
  const trimmed = fullName.trim();
  // Nếu tên <= 15 ký tự: Giữ nguyên toàn bộ
  if (trimmed.length <= 15) return trimmed;

  // Nếu tên dài hơn 15 ký tự: Tách lấy 2 từ cuối cùng (Tên lót + Tên chính)
  const words = trimmed.split(/\s+/);
  if (words.length >= 2) {
    const shortName = words.slice(-2).join(' ');
    if (shortName.length <= 15) return shortName;
    return shortName.slice(0, 14) + '…';
  }
  return trimmed.slice(0, 14) + '…';
};

export function LeaderboardSidebar() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const { setViewingUser, setShowProfileModal } = useAuth();

  useEffect(() => {
    let localUsers: TopUser[] = [];
    const gameNodes = ['leaderboard_vuihoc', 'leaderboard', 'leaderboard_memory', 'leaderboard_verses', 'leaderboard_demons', 'guestScores'];
    const unsubscribers: (() => void)[] = [];
    const nodeDataMap = new Map<string, TopUser[]>();

    const updateCombined = () => {
      let all = [...localUsers];
      for (const guests of nodeDataMap.values()) {
        all = all.concat(guests);
      }
      
      all = all.filter(u => u.totalScore > 0 && u.totalScore <= 2500);
      
      const uniqueUsers = new Map<string, TopUser>();
      for (const user of all) {
          const nameKey = user.fullName.toLowerCase().trim();
          if (!uniqueUsers.has(nameKey) || uniqueUsers.get(nameKey)!.totalScore < user.totalScore) {
              uniqueUsers.set(nameKey, user);
          }
      }
      all = Array.from(uniqueUsers.values());

      if (all.length > 0) {
        all.sort((a, b) => b.totalScore - a.totalScore);
        setTopUsers(all.slice(0, 10));
      }
      setLoading(false);
    };

    const unsubUsers = onValue(ref(rtdb, 'users'), (snapshot) => {
      localUsers = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const key in data) {
          const user = data[key];
          localUsers.push({
            id: key,
            saintName: user.saintName || '',
            fullName: user.displayName || user.fullName || 'Khách',
            avatarUrl: user.avatarUrl || '',
            totalScore: user.totalScore || 0,
          });
        }
      }
      updateCombined();
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });
    unsubscribers.push(unsubUsers);

    gameNodes.forEach(node => {
      const unsub = onValue(ref(rtdb, node), (snapshot) => {
        let nodeGuests: TopUser[] = [];
        if (snapshot.exists()) {
          const data = snapshot.val();
          for (const key in data) {
            const guest = data[key];
            nodeGuests.push({
              id: key,
              saintName: guest.saintName || '',
              fullName: guest.displayName || guest.name || 'Khách',
              avatarUrl: guest.avatarUrl || '',
              totalScore: guest.score || guest.totalScore || 0,
            });
          }
        }
        nodeDataMap.set(node, nodeGuests);
        updateCombined();
      }, (error) => {
        console.error(`Error fetching ${node}:`, error);
        setLoading(false);
      });
      unsubscribers.push(unsub);
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [])

  return (
    <div className="w-full lg:w-80 p-5 rounded-[32px] bg-white/95 backdrop-blur-md border-2 border-white shadow-[0_12px_24px_rgba(14,165,233,0.15)] pointer-events-auto">
      {/* Tiêu đề */}
      <div 
        className="flex items-center justify-between mb-2 lg:mb-6 pb-2 lg:pb-4 lg:border-b border-sky-100 cursor-pointer lg:cursor-default"
        onClick={() => setIsOpenMobile(!isOpenMobile)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Trophy size={28} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
            <div className="absolute inset-0 bg-amber-400 blur-xl opacity-30 rounded-full" />
          </div>
          <h2 className="font-display font-black text-lg text-sky-900 uppercase tracking-tight">
            BẢNG VÀNG DANH DỰ
          </h2>
        </div>
        <div className="lg:hidden text-sky-400 hover:text-sky-600 transition-colors p-1">
          {isOpenMobile ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {/* Danh sách */}
      <div className={`flex flex-col gap-3 transition-all duration-300 overflow-hidden ${isOpenMobile ? 'max-h-[2000px] mt-4 opacity-100 border-t border-sky-100 pt-4 lg:mt-0 lg:pt-0 lg:border-none' : 'max-h-0 opacity-0 lg:max-h-[2000px] lg:opacity-100'}`}>
        {loading ? (
          <div className="text-center py-8 text-slate-400">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Đang tải dữ liệu...
          </div>
        ) : topUsers.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">
            Chưa có kỷ lục nào.
          </div>
        ) : (
          topUsers.map((user, index) => {
            const rank = index + 1;
            
            return (
              <div 
                key={user.id}
                className="flex items-center justify-between py-2 px-3 rounded-2xl hover:bg-sky-50 transition-colors duration-200"
              >
                {/* Cụm Avatar + Badge đè góc */}
                <div className="relative shrink-0 w-10 h-10 mr-3">
                  <img 
                    src={user.avatarUrl || getAvatarByName(user.fullName)}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                    {rank === 1 ? (
                      <span className="text-base leading-none drop-shadow-md">🥇</span>
                    ) : rank === 2 ? (
                      <span className="text-base leading-none drop-shadow-md">🥈</span>
                    ) : rank === 3 ? (
                      <span className="text-base leading-none drop-shadow-md">🥉</span>
                    ) : (
                      <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-white text-[10px] text-slate-500 border border-slate-200 font-bold shadow-xs">
                        {rank}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tên người chơi rộng rãi */}
                <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
                  <p className="text-xs sm:text-[13px] font-bold text-slate-800 leading-tight truncate" title={`${user.saintName ? user.saintName + ' ' : ''}${user.fullName}`}>
                    {user.saintName ? <span className="text-slate-400 text-xs mr-1">{user.saintName}</span> : null}
                    {formatPlayerName(user.fullName)}
                  </p>
                </div>

                {/* Điểm số & Nút Ghé Thăm */}
                <div className="shrink-0 flex items-center justify-end gap-2 pl-2">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-amber-500 font-mono tracking-tight drop-shadow-sm">
                      {user.totalScore.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-[10px] text-amber-400 ml-1 font-bold">pts</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setViewingUser(user.id, user.fullName); setShowProfileModal(true); }}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 text-amber-500 hover:text-amber-600 transition-colors shadow-sm active:scale-95"
                    title="Ghé thăm nhà"
                  >
                    <Home size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
