import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Search, Brain, BookOpen, Users, Trophy } from 'lucide-react'
import { GAMES_LIST, type GameCategory } from '@/config/gamesList'
import { LeaderboardSidebar } from '@/components/LeaderboardSidebar'
import { HeroBanner } from '@/components/HeroBanner'
import { StickerAlbumHub } from '@/components/StickerAlbumHub'

const iconMap: Record<string, React.ReactNode> = {
  'Brain': <Brain size={24} />,
  'BookOpen': <BookOpen size={24} />,
  'Users': <Users size={24} />,
  'Trophy': <Trophy size={24} />
}

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'TẤT CẢ' | GameCategory>('TẤT CẢ')

  useEffect(() => {
    document.title = "Gameshow Công Giáo - Vui Học Cùng Thầy Giêsu"
  }, [])

  const filteredGames = useMemo(() => {
    return GAMES_LIST.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTab = activeTab === 'TẤT CẢ' || game.category === activeTab
      return matchesSearch && matchesTab
    })
  }, [searchTerm, activeTab])

  const tabs = ['TẤT CẢ', 'ĐUA TOP', 'SINH HOẠT', 'CÔNG CỤ'] as const

  return (
    <div className="w-full min-h-screen bg-[#F1F7FD] pt-20 md:pt-24 pb-16 px-4">
      {/* ======================================================== */}
      {/* TIER 1: HERO BANNER & DAILY QUEST (FULL WIDTH)             */}
      {/* ======================================================== */}
      <HeroBanner />
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-8 pt-4 pb-20">
        
        {/* ======================================================== */}
        {/* TIER 2: MAIN LAYOUT (GRID COL-12)                          */}
        {/* ======================================================== */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* ---------------------------------------------------- */}
          {/* TIER 2 - LEFT COLUMN (COL-8): SEARCH, TABS, GAMES    */}
          {/* ---------------------------------------------------- */}
          <div className="lg:col-span-8 flex flex-col gap-8 min-w-0">
            
            {/* Thanh Tìm Kiếm & Tabs */}
            <div id="games-section" className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border border-white/80 shadow-[0_12px_24px_rgba(14,165,233,0.1)]">
              {/* Hàng 1 (Thanh Tìm Kiếm) */}
              <div className="max-w-xl mx-auto w-full mb-5 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6 text-slate-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm trò chơi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border-2 border-white bg-white/90 py-3.5 pl-14 pr-6 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-200 shadow-sm transition-all"
                />
              </div>

              {/* Hàng 2 (Dãy Tag Danh Mục) */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      rounded-full px-4 py-2 text-xs font-bold transition-all
                      ${activeTab === tab 
                        ? 'bg-rose-400 text-white border-b-4 border-rose-600 shadow-md transform -translate-y-1' 
                        : 'bg-white text-slate-500 border-b-2 border-slate-200 hover:bg-sky-50 hover:text-sky-600'
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Danh Sách Game Grid */}
            {filteredGames.length === 0 ? (
              <div className="py-20 text-center text-slate-500">
                <p className="text-lg font-bold">Không tìm thấy trò chơi nào phù hợp.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-y-6">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}

            {/* Showcase & Banner Phía Dưới Cột Trái */}
            <div className="mt-12">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.08)] border border-white/80 bg-white/40 backdrop-blur-md mb-10">
                <img 
                  src="/images/banner.jpg" 
                  alt="Công Giáo Game Shows - Vui Học Cùng Thầy Giêsu" 
                  className="w-full h-auto max-h-[220px] object-cover object-center"
                />
              </div>

              <div className="text-center mb-10">
                <h2 className="mb-2 font-display text-3xl font-black text-sky-800">GAME NỔI BẬT</h2>
                <div className="mx-auto h-1.5 w-24 rounded-full bg-rose-400 animate-pulse" />
              </div>

              <div className="flex flex-col gap-10">
                {/* Showcase 1: Rung Chuông Vàng */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 py-6 border-b border-slate-200/50">
                  <div className="flex-1 text-center sm:text-left space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      🔔 Hiện có sẵn
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-sky-800 tracking-tight">Rung Chuông Vàng</h3>
                    <p className="text-amber-500 font-bold text-sm italic">"Học mà chơi - chơi mà lớn lên trong đức tin"</p>
                    <p className="text-slate-600 text-sm leading-relaxed">Nền tảng thi đấu giáo lý đối kháng đỉnh cao, mượt mà hỗ trợ lên đến 500 thí sinh cùng lúc.</p>
                    <div className="pt-2">
                      <Link className="btn-cartoon-3d inline-flex items-center gap-2 px-6 py-3 text-sm" to="/games/rung-chuong-vang">▶ CHƠI NGAY</Link>
                    </div>
                  </div>
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 flex items-center justify-center">
                    <img src="/images/games/rung-chuong-vang.webp" alt="Rung Chuông Vàng" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)] hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>

                {/* Showcase 2: Chiếc Nón Kỳ Diệu */}
                <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-8 py-6 border-b border-slate-200/50">
                  <div className="flex-1 text-center sm:text-left space-y-3 sm:pl-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      🔔 Hiện có sẵn
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-sky-800 tracking-tight">Chiếc Nón Kỳ Diệu</h3>
                    <p className="text-sky-600 font-bold text-sm italic">"Vòng quay may mắn, khám phá ô chữ Đức Tin"</p>
                    <p className="text-slate-600 text-sm leading-relaxed">Trò chơi sinh hoạt lý tưởng cho cộng đoàn, trại hè thiếu nhi và các dịp lễ lớn.</p>
                    <div className="pt-2">
                      <Link className="btn-cartoon-3d inline-flex items-center gap-2 px-6 py-3 text-sm" to="/games/chiec-non-ky-dieu">▶ CHƠI NGAY</Link>
                    </div>
                  </div>
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 flex items-center justify-center">
                    <img src="/images/games/chiec-non-ky-dieu.webp" alt="Chiếc Nón Kỳ Diệu" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)] hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* ---------------------------------------------------- */}
          {/* TIER 2 - RIGHT COLUMN (COL-4): LEADERBOARD & BADGES  */}
          {/* ---------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col gap-8 w-full">
            <LeaderboardSidebar />
          </div>

        </main>

        {/* ======================================================== */}
        {/* TIER 3: STICKER ALBUM HUB (FULL WIDTH BOTTOM)              */}
        {/* ======================================================== */}
        <div className="mt-12 w-full">
           <StickerAlbumHub />
        </div>

      </div>
    </div>
  )
}

function GameCard({ game }: { game: typeof GAMES_LIST[0] }) {
  const isReady = game.status === 'ready'
  
  const CardContent = () => (
    <>
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mb-3">
        {game.badge && (
          <span className={`absolute -top-1 -right-1 z-20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white shadow-md ${
            game.badge === 'HOT' ? 'bg-red-500' : 'bg-emerald-500'
          }`}>
            {game.badge}
          </span>
        )}

        {game.thumbnailUrl ? (
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_20px_30px_rgba(59,130,246,0.3)] transition-all duration-300"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center rounded-[2rem] drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-300 group-hover:drop-shadow-[0_20px_30px_rgba(59,130,246,0.3)] bg-white/50 backdrop-blur-md border border-white/60"
            style={{ color: isReady ? game.color : '#94a3b8' }}
          >
            {game.icon && iconMap[game.icon] ? iconMap[game.icon] : <Play size={48} />}
          </div>
        )}
      </div>

      <h3 className="font-extrabold text-sm sm:text-base text-sky-800 tracking-tight group-hover:text-sky-600 transition-colors line-clamp-1">
        {game.title}
      </h3>

      <span className="mt-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        {game.category} {isReady ? '' : ' (Sắp ra mắt)'}
      </span>
    </>
  )

  const classes = `group flex flex-col items-center text-center p-3 sm:p-4 bg-white border border-sky-100/60 rounded-[28px] shadow-[0_10px_25px_rgba(2,132,199,0.05)] hover:border-sky-200 hover:shadow-[0_20px_40px_rgba(14,165,233,0.15)] transition-all duration-300 hover:-translate-y-2 active:scale-95 ${!isReady ? 'opacity-70 cursor-not-allowed' : ''}`

  if (isReady && game.route) {
    return (
      <Link to={game.route} className={classes}>
        <CardContent />
      </Link>
    )
  }

  return (
    <div className={classes}>
      <CardContent />
    </div>
  )
}

