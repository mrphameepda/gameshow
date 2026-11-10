import { useEffect, useState } from 'react'
import { ref, onValue, update, increment } from 'firebase/database'
import { rtdb } from '@/config/firebase'
import { Trophy, Gift, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getAvatarByName } from '@/utils/avatarHelper'
import { formatPlayerName } from '@/components/LeaderboardSidebar'

interface TopLeaderboardUser {
  id: string
  fullName: string
  avatarUrl?: string
  totalScore: number
}

const BIBLE_VERSES = [
  "Thầy là đường, là sự thật và là sự sống. (Ga 14,6)",
  "Thiên Chúa là tình yêu. (1 Ga 4,8)",
  "Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em. (Ga 15,12)",
  "Phúc thay ai xót thương người, vì họ sẽ được Thiên Chúa xót thương. (Mt 5,7)",
  "Lạy Chúa, xin thêm đức tin cho chúng con. (Lc 17,5)",
  "Hãy ký thác đường đời cho Chúa, tin tưởng vào Người, Người sẽ ra tay. (Tv 37,5)"
]

export function HomeRightWidgets() {
  const { currentUser, userProfile, setViewingUser, setShowProfileModal, setShowAuthModal } = useAuth()
  const [topUsers, setTopUsers] = useState<TopLeaderboardUser[]>([])
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)

  // Daily Devotion Gift Box State
  const [isClaimed, setIsClaimed] = useState(false)
  const [verse, setVerse] = useState('')
  const [isOpening, setIsOpening] = useState(false)

  const currentDate = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (userProfile?.dailyCheckIn?.lastCheckInDate === currentDate) {
      setIsClaimed(true)
      setVerse(BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)])
    }
  }, [userProfile, currentDate])

  // Lắng nghe dữ liệu realtime từ Firebase RTDB cho Leaderboard Top 5
  useEffect(() => {
    let localUsers: TopLeaderboardUser[] = []
    const gameNodes = ['leaderboard_vuihoc', 'leaderboard', 'leaderboard_memory', 'leaderboard_verses', 'leaderboard_demons', 'guestScores']
    const unsubscribers: (() => void)[] = []
    const nodeDataMap = new Map<string, TopLeaderboardUser[]>()

    const updateCombined = () => {
      let all = [...localUsers]
      for (const guests of nodeDataMap.values()) {
        all = all.concat(guests)
      }
      
      all = all.filter(u => u.totalScore > 0 && u.totalScore <= 2500)
      
      const uniqueUsers = new Map<string, TopLeaderboardUser>()
      for (const user of all) {
        const nameKey = user.fullName.toLowerCase().trim()
        if (!uniqueUsers.has(nameKey) || uniqueUsers.get(nameKey)!.totalScore < user.totalScore) {
          uniqueUsers.set(nameKey, user)
        }
      }
      all = Array.from(uniqueUsers.values())

      if (all.length > 0) {
        all.sort((a, b) => b.totalScore - a.totalScore)
        setTopUsers(all.slice(0, 5))
      }
      setLoadingLeaderboard(false)
    }

    const unsubUsers = onValue(ref(rtdb, 'users'), (snapshot) => {
      localUsers = []
      if (snapshot.exists()) {
        const data = snapshot.val()
        for (const key in data) {
          const user = data[key]
          localUsers.push({
            id: key,
            fullName: user.displayName || user.fullName || 'Khách',
            avatarUrl: user.avatarUrl || '',
            totalScore: user.totalScore || 0,
          })
        }
      }
      updateCombined()
    }, (error) => {
      console.error("Error fetching users:", error)
      setLoadingLeaderboard(false)
    })
    unsubscribers.push(unsubUsers)

    gameNodes.forEach(node => {
      const unsub = onValue(ref(rtdb, node), (snapshot) => {
        let nodeGuests: TopLeaderboardUser[] = []
        if (snapshot.exists()) {
          const data = snapshot.val()
          for (const key in data) {
            const guest = data[key]
            nodeGuests.push({
              id: key,
              fullName: guest.displayName || guest.name || 'Khách',
              avatarUrl: guest.avatarUrl || '',
              totalScore: guest.score || guest.totalScore || 0,
            })
          }
        }
        nodeDataMap.set(node, nodeGuests)
        updateCombined()
      }, (error) => {
        console.error(`Error fetching ${node}:`, error)
        setLoadingLeaderboard(false)
      })
      unsubscribers.push(unsub)
    })

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [])

  const handleClaimGift = async () => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }
    if (isClaimed || isOpening) return

    setIsOpening(true)
    try {
      const currentCount = userProfile?.dailyCheckIn?.checkInCount || 0
      const updates = {
        [`users/${currentUser.uid}/dailyCheckIn/lastCheckInDate`]: currentDate,
        [`users/${currentUser.uid}/dailyCheckIn/checkInCount`]: currentCount + 1,
        [`users/${currentUser.uid}/totalScore`]: increment(50)
      }
      await update(ref(rtdb), updates)
      setVerse(BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)])
      setIsClaimed(true)
    } catch (error) {
      console.error("Lỗi khi mở quà:", error)
    } finally {
      setIsOpening(false)
    }
  }

  const handleUserClick = (userId: string, userName: string) => {
    if (setViewingUser) setViewingUser(userId, userName)
    if (setShowProfileModal) setShowProfileModal(true)
  }

  return (
    <div className="w-full flex flex-col gap-6 sticky top-6">
      
      {/* ======================================================== */}
      {/* WIDGET 1: HỘP QUÀ LỜI CHÚA MỖI NGÀY (DAILY GIFT)        */}
      {/* ======================================================== */}
      <div className="bg-white rounded-[32px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sky-100/70 overflow-hidden relative">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Gift className="text-amber-500" size={20} />
            <h3 className="font-extrabold text-sm text-slate-800">
              Quà Tặng Lời Chúa
            </h3>
          </div>
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            Mỗi ngày
          </span>
        </div>

        {isClaimed ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700">
              <CheckCircle2 size={16} />
              <span>Đã nhận thưởng hôm nay (+50đ)</span>
            </div>
            <p className="text-xs text-slate-600 italic font-medium leading-relaxed">
              "{verse || BIBLE_VERSES[0]}"
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100/80">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center text-2xl mb-2.5 shadow-sm transform hover:scale-110 transition-transform">
              🎁
            </div>
            <p className="text-xs font-bold text-slate-700 mb-1">
              Điểm danh và nhận 50 điểm
            </p>
            <p className="text-[11px] text-slate-400 mb-3 leading-tight">
              Lắng nghe một câu Lời Chúa ý nghĩa mỗi ngày
            </p>
            <button
              onClick={handleClaimGift}
              disabled={isOpening}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-400/25 transition-all active:scale-95 disabled:opacity-50"
            >
              {isOpening ? 'Đang mở hộp...' : 'Mở Quà Ngay'}
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* WIDGET 2: BẢNG XẾP HẠNG THỜI GIAN THỰC (TOP 5 LEADERBOARD) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-[32px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sky-100/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} />
            <h3 className="font-extrabold text-sm text-slate-800">
              Top Cao Thủ Sảnh Game
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
            Realtime
          </span>
        </div>

        {loadingLeaderboard ? (
          <div className="py-6 text-center text-xs text-slate-400 font-medium animate-pulse">
            Đang tải bảng xếp hạng...
          </div>
        ) : topUsers.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 font-medium">
            Chưa có người chơi nào ghi danh.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {topUsers.map((user, index) => {
              const isCurrentUser = currentUser && user.id === currentUser.uid
              const rankMedals = ['🥇', '🥈', '🥉']

              return (
                <div
                  key={user.id + index}
                  onClick={() => handleUserClick(user.id, user.fullName)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    isCurrentUser
                      ? 'bg-amber-50/70 border-amber-200 shadow-sm'
                      : 'bg-slate-50/60 border-slate-100 hover:bg-sky-50/60 hover:border-sky-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-center font-black text-xs text-slate-400">
                      {index < 3 ? rankMedals[index] : index + 1}
                    </span>

                    <img
                      src={user.avatarUrl || getAvatarByName(user.fullName)}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white bg-white flex-shrink-0"
                    />

                    <div className="min-w-0">
                      <p className="font-extrabold text-xs text-slate-800 truncate max-w-[120px]">
                        {formatPlayerName(user.fullName)}
                      </p>
                      {isCurrentUser && (
                        <span className="text-[9px] font-black uppercase text-amber-600">
                          (Bạn)
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-black text-xs text-sky-600 flex-shrink-0">
                    {user.totalScore.toLocaleString()}đ
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* WIDGET 3: THÔNG TIN TÁC QUYỀN MỤC VỤ (AGENTS.MD COMPLIANT)  */}
      {/* ======================================================== */}
      <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-center space-y-1 text-slate-500">
        <p className="text-[11px] font-bold text-slate-700">
          Tác giả: <span className="text-sky-700 font-extrabold">Giuse Phạm Duy Ái, SDS</span>
        </p>
        <p className="text-[10px] text-slate-400">
          Email: mrphamee@gmail.com
        </p>
        <p className="text-[9px] text-slate-400 pt-1">
          Dành tặng cho giáo dục mục vụ Thiếu Nhi & Cộng Đoàn
        </p>
      </div>

    </div>
  )
}
