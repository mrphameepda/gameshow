import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { rtdb } from '@/config/firebase'
import { Trophy, X, Home } from 'lucide-react'
import { getAvatarByName } from '@/utils/avatarHelper'
import { useAuth } from '@/contexts/AuthContext'
import { formatPlayerName, type TopUser } from '@/components/LeaderboardSidebar'

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [loading, setLoading] = useState(true)
  const { setViewingUser, setShowProfileModal, currentUser } = useAuth()

  useEffect(() => {
    if (!isOpen) return

    let localUsers: TopUser[] = []
    const gameNodes = [
      'leaderboard_vuihoc',
      'leaderboard',
      'leaderboard_memory',
      'leaderboard_verses',
      'leaderboard_demons',
      'guestScores'
    ]
    const unsubscribers: (() => void)[] = []
    const nodeDataMap = new Map<string, TopUser[]>()

    const updateCombined = () => {
      let all = [...localUsers]
      for (const guests of nodeDataMap.values()) {
        all = all.concat(guests)
      }

      all = all.filter(u => u.totalScore > 0 && u.totalScore <= 2500)

      const uniqueUsers = new Map<string, TopUser>()
      for (const user of all) {
        const nameKey = user.fullName.toLowerCase().trim()
        if (!uniqueUsers.has(nameKey) || uniqueUsers.get(nameKey)!.totalScore < user.totalScore) {
          uniqueUsers.set(nameKey, user)
        }
      }
      all = Array.from(uniqueUsers.values())

      if (all.length > 0) {
        all.sort((a, b) => b.totalScore - a.totalScore)
        setTopUsers(all.slice(0, 15))
      }
      setLoading(false)
    }

    const unsubUsers = onValue(
      ref(rtdb, 'users'),
      snapshot => {
        localUsers = []
        if (snapshot.exists()) {
          const data = snapshot.val()
          for (const key in data) {
            const user = data[key]
            localUsers.push({
              id: key,
              saintName: user.saintName || '',
              fullName: user.displayName || user.fullName || 'Khách',
              avatarUrl: user.avatarUrl || '',
              totalScore: user.totalScore || 0
            })
          }
        }
        updateCombined()
      },
      error => {
        console.error('Error fetching users:', error)
        setLoading(false)
      }
    )
    unsubscribers.push(unsubUsers)

    gameNodes.forEach(node => {
      const unsub = onValue(
        ref(rtdb, node),
        snapshot => {
          let nodeGuests: TopUser[] = []
          if (snapshot.exists()) {
            const data = snapshot.val()
            for (const key in data) {
              const guest = data[key]
              nodeGuests.push({
                id: key,
                saintName: guest.saintName || '',
                fullName: guest.displayName || guest.name || 'Khách',
                avatarUrl: guest.avatarUrl || '',
                totalScore: guest.score || guest.totalScore || 0
              })
            }
          }
          nodeDataMap.set(node, nodeGuests)
          updateCombined()
        },
        error => {
          console.error(`Error fetching ${node}:`, error)
          setLoading(false)
        }
      )
      unsubscribers.push(unsub)
    })

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-md max-h-[85vh] bg-white rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
              <Trophy size={22} className="text-white drop-shadow-sm" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-sky-900 leading-tight">
                BẢNG VÀNG DANH DỰ
              </h3>
              <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                Top Cao Thủ Giáo Lý
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Danh sách người chơi cuộn */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1 my-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="w-7 h-7 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Đang cập nhật dữ liệu...</p>
            </div>
          ) : topUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              Chưa có kỷ lục nào được ghi nhận.
            </div>
          ) : (
            topUsers.map((user, index) => {
              const rank = index + 1
              const isCurrent = currentUser && user.id === currentUser.uid

              return (
                <div
                  key={user.id + index}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-200 shadow-sm'
                      : 'bg-slate-50/70 border-slate-100 hover:bg-sky-50/70 hover:border-sky-100'
                  }`}
                >
                  {/* Cụm Avatar + Huy chương Rank */}
                  <div className="relative shrink-0 w-10 h-10 mr-2.5">
                    <img
                      src={user.avatarUrl || getAvatarByName(user.fullName)}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs bg-white"
                    />
                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                      {rank === 1 ? (
                        <span className="text-base leading-none drop-shadow-xs">🥇</span>
                      ) : rank === 2 ? (
                        <span className="text-base leading-none drop-shadow-xs">🥈</span>
                      ) : rank === 3 ? (
                        <span className="text-base leading-none drop-shadow-xs">🥉</span>
                      ) : (
                        <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-white text-[9px] text-slate-600 border border-slate-200 font-black shadow-2xs">
                          {rank}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tên Người Chơi */}
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {user.saintName ? <span className="text-slate-400 text-xs mr-1">{user.saintName}</span> : null}
                      {formatPlayerName(user.fullName)}
                      {isCurrent ? <span className="text-amber-500 text-[10px] ml-1.5 font-black">(Bạn)</span> : null}
                    </p>
                  </div>

                  {/* Điểm số & Ghé thăm */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-amber-500 font-mono">
                      {user.totalScore.toLocaleString('vi-VN')} <span className="text-[10px] text-amber-400 font-sans">đ</span>
                    </span>
                    <button
                      onClick={() => {
                        setViewingUser(user.id, user.fullName)
                        setShowProfileModal(true)
                        onClose()
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600 transition-colors shadow-2xs active:scale-95"
                      title="Ghé thăm nhà"
                    >
                      <Home size={13} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Nút đóng modal dưới cùng */}
        <button
          onClick={onClose}
          className="w-full mt-2 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all active:scale-95"
        >
          Đóng Bảng Vàng
        </button>
      </div>
    </div>
  )
}
