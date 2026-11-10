import { Link } from 'react-router-dom'
import { Play, Trophy } from 'lucide-react'
import type { GameListItem } from '@/config/gamesList'
import { useAuth } from '@/contexts/AuthContext'

interface HomeGameCardProps {
  game: GameListItem
}

export function HomeGameCard({ game }: HomeGameCardProps) {
  const { userProfile } = useAuth()
  const isReady = game.status === 'ready'
  const personalScore = userProfile?.gameScores?.[game.id]?.bestScore

  const CardContent = () => (
    <div className="flex flex-col items-center text-center p-4 sm:p-5 h-full justify-between">
      {/* THUMBNAIL & BADGE */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-3 flex items-center justify-center">
        {game.badge && (
          <span className={`absolute -top-1 -right-1 z-20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white shadow-md ${
            game.badge === 'HOT' ? 'bg-rose-500' : 'bg-emerald-500'
          }`}>
            {game.badge}
          </span>
        )}

        {game.thumbnailUrl ? (
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:drop-shadow-[0_16px_28px_rgba(59,130,246,0.25)] transition-all duration-300"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center rounded-[2rem] bg-sky-50 border border-sky-100 text-sky-500 group-hover:scale-105 transition-all"
          >
            <Play size={40} />
          </div>
        )}
      </div>

      {/* TÊN VÀ THỂ LOẠI */}
      <div className="w-full space-y-1 mb-3">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
          {game.title}
        </h3>
        
        <span className="inline-block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {game.category}
        </span>
      </div>

      {/* THÔNG TIN KỶ LỤC HOẶC NÚT CHƠI */}
      <div className="w-full pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs">
        {personalScore !== undefined ? (
          <div className="flex items-center gap-1 text-amber-600 font-extrabold">
            <Trophy size={13} className="text-amber-500" />
            <span>Kỷ lục: {personalScore}đ</span>
          </div>
        ) : (
          <span className="text-[11px] font-semibold text-slate-400">Chưa chơi</span>
        )}

        <span className="inline-flex items-center gap-1 font-black text-sky-600 group-hover:translate-x-0.5 transition-transform">
          Chơi <Play size={10} className="fill-sky-600" />
        </span>
      </div>
    </div>
  )

  const cardClasses = `group block bg-white border border-sky-100/70 rounded-[28px] shadow-[0_8px_24px_rgba(2,132,199,0.05)] hover:border-sky-300/80 hover:shadow-[0_16px_36px_rgba(14,165,233,0.14)] transition-all duration-300 hover:-translate-y-1.5 active:scale-95 overflow-hidden ${
    !isReady ? 'opacity-60 cursor-not-allowed' : ''
  }`

  if (isReady && game.route) {
    return (
      <Link to={game.route} className={cardClasses}>
        <CardContent />
      </Link>
    )
  }

  return (
    <div className={cardClasses}>
      <CardContent />
    </div>
  )
}

