import HomeButton from '../../components/HomeButton';
// src/games/ung-dung-xo-so/LotteryGame.tsx
import { useState, useEffect, useRef } from 'react'
import { Maximize2, Minimize2, Trash2, Play, Square, Pause, Settings } from 'lucide-react'
import confetti from 'canvas-confetti'
import { soundManager } from '@/core/soundManager'

// Fallback images since downloads failed
const bgOptions = {
  none: '',
  christmas: '/images/xo-so/bg-christmas.jpg',
  tet: '/images/xo-so/bg-tet.png',
  easter: '/images/xo-so/bg-easter.jpg'
}

type HistoryItem = {
  id: number
  result: string
}

export default function LotteryGame() {
  const [title, setTitle] = useState("CHƯƠNG TRÌNH XỔ SỐ")
  const [diocese, setDiocese] = useState("")
  const [parish, setParish] = useState("")
  const [eventBg, setEventBg] = useState<keyof typeof bgOptions>("none")
  const [customBg, setCustomBg] = useState("")
  const [digits, setDigits] = useState(6)
  const [bgAudioUrl, setBgAudioUrl] = useState("")
  
  const [slots, setSlots] = useState<number[]>(Array(6).fill(0))
  const [lockedCount, setLockedCount] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  
  const appRef = useRef<HTMLDivElement>(null)
  const intervalRefs = useRef<(ReturnType<typeof setInterval> | null)[]>([])
  const customAudioRef = useRef<HTMLAudioElement | null>(null)
  const hasSavedRef = useRef(false)

  useEffect(() => {
    soundManager.register('xo-so', 'spin', '/sounds/xo-so/spin.ogg', true)
    soundManager.register('xo-so', 'tick', '/sounds/xo-so/tick.ogg')
    soundManager.register('xo-so', 'win', '/sounds/xo-so/win.ogg')

    customAudioRef.current = new Audio()
    customAudioRef.current.loop = true

    const saved = localStorage.getItem('lottery_history')
    if (saved) {
      try { setHistory(JSON.parse(saved)) } catch(e) {}
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      intervalRefs.current.forEach(id => id && clearInterval(id))
      soundManager.stop('xo-so', 'spin')
      if (customAudioRef.current) customAudioRef.current.pause()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('lottery_history', JSON.stringify(history))
  }, [history])

  // Re-init slots when digits change
  useEffect(() => {
    if (!spinning) {
      setSlots(Array(digits).fill(0))
      setLockedCount(0)
    }
  }, [digits])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await appRef.current?.requestFullscreen().catch(() => alert("Không thể phóng to"))
    } else {
      document.exitFullscreen()
    }
  }

  const startSpin = () => {
    if (spinning) return
    setSpinning(true)
    setIsPaused(false)
    setLockedCount(0)
    hasSavedRef.current = false
    
    if (bgAudioUrl && customAudioRef.current) {
      customAudioRef.current.src = bgAudioUrl
      customAudioRef.current.play().catch(() => soundManager.play('xo-so', 'spin'))
    } else {
      soundManager.play('xo-so', 'spin')
    }

    startIntervals()
  }

  const startIntervals = () => {
    intervalRefs.current.forEach(id => id && clearInterval(id))
    intervalRefs.current = Array(digits).fill(null)
    
    const newIntervals = Array(digits).fill(null).map((_, idx) => {
      if (idx >= digits - lockedCount) return null
      return setInterval(() => {
        setSlots(prev => {
          const next = [...prev]
          next[idx] = Math.floor(Math.random() * 10)
          return next
        })
      }, 50 + (idx * 15))
    })
    intervalRefs.current = newIntervals
  }

  const togglePause = () => {
    if (!spinning) return
    if (isPaused) {
      // Resume
      setIsPaused(false)
      if (bgAudioUrl && customAudioRef.current) {
        customAudioRef.current.play().catch(() => soundManager.play('xo-so', 'spin'))
      } else {
        soundManager.play('xo-so', 'spin')
      }
      startIntervals()
    } else {
      // Pause
      setIsPaused(true)
      intervalRefs.current.forEach(id => id && clearInterval(id))
      soundManager.stop('xo-so', 'spin')
      if (customAudioRef.current) customAudioRef.current.pause()
    }
  }

  const manualStop = () => {
    if (!spinning || isPaused) return
    const indexToStop = digits - 1 - lockedCount
    
    if (indexToStop >= 0) {
      const id = intervalRefs.current[indexToStop]
      if (id) clearInterval(id)
      intervalRefs.current[indexToStop] = null
      
      soundManager.play('xo-so', 'tick')
      setLockedCount(prev => {
        const next = prev + 1
        if (next === digits) finishSpinning()
        return next
      })
    }
  }

  const finishSpinning = () => {
    if (hasSavedRef.current) return
    hasSavedRef.current = true
    
    setSpinning(false)
    setIsPaused(false)
    soundManager.stop('xo-so', 'spin')
    if (customAudioRef.current) customAudioRef.current.pause()
    soundManager.play('xo-so', 'win')
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
    
    setSlots(currentSlots => {
      const resultStr = currentSlots.join('')
      setHistory(prev => {
        if (prev.length > 0 && prev[0].result === resultStr) {
           return prev
        }
        return [{ id: Date.now(), result: resultStr }, ...prev]
      })
      return currentSlots
    })
  }

  const deleteHistory = (id: number) => {
    setHistory(prev => prev.filter(h => h.id !== id))
  }

  const currentBgUrl = customBg || (eventBg !== 'none' ? bgOptions[eventBg] : '')

  const SettingsForm = () => (
    <>
      <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
        <label className="text-[10px] font-bold text-slate-300 uppercase">Tiêu đề</label>
        <input 
          value={title} onChange={e => setTitle(e.target.value)}
          maxLength={50}
          className="rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs p-2 outline-none focus:border-amber-400 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
        <label className="text-[10px] font-bold text-slate-300 uppercase">Giáo phận</label>
        <input 
          value={diocese} onChange={e => setDiocese(e.target.value.slice(0, 30))}
          maxLength={30} placeholder="Tên Giáo phận"
          className="rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs p-2 outline-none focus:border-amber-400 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
        <label className="text-[10px] font-bold text-slate-300 uppercase">Giáo xứ</label>
        <input 
          value={parish} onChange={e => setParish(e.target.value.slice(0, 30))}
          maxLength={30} placeholder="Tên Giáo xứ"
          className="rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs p-2 outline-none focus:border-amber-400 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1 w-full sm:flex-[0.8] min-w-[110px]">
        <label className="text-[10px] font-bold text-slate-300 uppercase">Sự kiện</label>
        <select 
          value={eventBg} 
          onChange={e => { setEventBg(e.target.value as keyof typeof bgOptions); setCustomBg(""); }}
          className="rounded-xl bg-white/10 border border-white/20 text-white text-xs p-2 outline-none focus:border-amber-400 transition-colors [&>option]:bg-slate-800"
        >
          <option value="none">-- Tùy chọn --</option>
          <option value="christmas">🎄 Giáng sinh</option>
          <option value="tet">🧧 Tết Nguyên Đán</option>
          <option value="easter">🕊️ Phục sinh</option>
        </select>
      </div>
      <div className="flex flex-col gap-1 w-full sm:flex-[0.6] min-w-[80px]">
        <label className="text-[10px] font-bold text-slate-300 uppercase">Chữ số</label>
        <select 
          value={digits} onChange={e => setDigits(Number(e.target.value))} disabled={spinning}
          className="rounded-xl bg-white/10 border border-white/20 text-white text-xs p-2 outline-none focus:border-amber-400 transition-colors [&>option]:bg-slate-800"
        >
          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} số</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
        <label className="text-[10px] font-bold text-slate-300 uppercase">URL Hình nền</label>
        <input 
          value={customBg} 
          onChange={e => { setCustomBg(e.target.value); setEventBg('none'); }}
          placeholder="Dán link ảnh"
          className="rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs p-2 outline-none focus:border-amber-400 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
        <label className="text-[10px] font-bold text-slate-300 uppercase">URL Nhạc nền</label>
        <input 
          value={bgAudioUrl} 
          onChange={e => setBgAudioUrl(e.target.value)}
          placeholder="Dán link mp3"
          className="rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs p-2 outline-none focus:border-amber-400 transition-colors"
        />
      </div>
    </>
  )

  return (
    <div 
      className="flex min-h-screen flex-col font-sans text-white bg-slate-950/40 backdrop-blur-sm"
      style={{ backgroundImage: currentBgUrl ? `url('${currentBgUrl}')` : "url('/images/bk1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      <div 
        ref={appRef}
        className={`relative w-full flex flex-col ${isFullscreen ? 'h-screen' : 'min-h-screen max-w-[1600px] mx-auto'}`}
      >
        {/* Header with Home and Fullscreen */}
        <header className="p-4 flex items-center justify-between z-10 relative">
          <HomeButton confirmExit={false} />
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="lg:hidden flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold p-2.5 rounded-full border border-white/20 backdrop-blur-md transition-all shadow-lg text-sm px-4 gap-2"
            >
              <Settings size={20} /> Cài đặt
            </button>
            <button 
              onClick={toggleFullscreen}
              className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold p-2.5 rounded-full border border-white/20 backdrop-blur-md transition-all shadow-lg"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </header>

        {/* Admin Panel (Desktop) */}
        {!isFullscreen && (
          <div className="hidden lg:flex flex-wrap items-end justify-center gap-4 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 p-3 shadow-lg z-10 relative">
            <SettingsForm />
          </div>
        )}

        {/* Mobile Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm lg:hidden">
            <div className="w-full max-h-[85vh] overflow-y-auto bg-slate-900 border-t border-white/10 rounded-t-3xl p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom">
              <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-3">
                <h2 className="text-lg font-bold text-amber-400">⚙️ Cài đặt hệ thống</h2>
                <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="flex flex-col gap-4">
                <SettingsForm />
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="mt-4 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 text-lg transition-colors"
              >
                Áp dụng / Đóng
              </button>
            </div>
          </div>
        )}

        {/* Display Area */}
        <div className={`relative flex flex-1 flex-col items-center w-full z-10 ${isFullscreen ? 'justify-center p-[5vh_5vw]' : 'p-4 lg:p-8'}`}>
          <div className="w-full text-left mb-4 drop-shadow-lg">
            <div className="text-[clamp(1.1rem,3vw,1.6rem)] font-black text-yellow-400 truncate">{diocese || "GIÁO PHẬN ..."}</div>
            <div className="text-[clamp(0.9rem,2vw,1.2rem)] font-extrabold text-gray-200 truncate">{parish || "GIÁO XỨ ..."}</div>
          </div>

          <h1 className="w-full text-center font-display text-[clamp(22px,5vw,50px)] font-black text-yellow-400 mb-8" style={{ textShadow: '3px 3px 0px #c0392b' }}>
            {title || "CHƯƠNG TRÌNH XỔ SỐ"}
          </h1>

          <div className="flex w-full flex-wrap justify-center gap-6 items-stretch flex-1 min-h-0">
            {/* Lottery Main */}
            <div className="flex-[2] min-w-[300px] flex flex-col justify-center items-center bg-slate-900/70 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl">
              <div id="slot-container" className="flex flex-nowrap justify-center items-center gap-1.5 sm:gap-3 w-full px-2 mb-10">
                {slots.map((val, idx) => {
                  const isLocked = idx >= digits - lockedCount
                  return (
                    <div 
                      key={idx}
                      className={`w-[14%] max-w-[75px] aspect-[2/3] text-2xl sm:text-4xl md:text-6xl font-black rounded-xl sm:rounded-2xl flex items-center justify-center font-display shadow-xl transition-all duration-200
                        ${isLocked 
                          ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 border-b-4 border-amber-600 scale-105 shadow-amber-500/50' 
                          : 'bg-gradient-to-b from-white to-slate-200 text-slate-900 border-b-4 border-slate-300'
                        }`}
                    >
                      {val}
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-center mt-4 w-full max-w-[400px]">
                {!spinning ? (
                  <button 
                    onClick={startSpin}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 px-10 text-lg shadow-lg shadow-emerald-500/30 font-display transition-all"
                  >
                    <Play size={24} className="fill-white" /> BẮT ĐẦU QUAY
                  </button>
                ) : (
                  <div className="flex w-full gap-3">
                    <button 
                      onClick={manualStop}
                      disabled={isPaused}
                      className={`flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-full text-white font-black py-4 px-2 sm:px-6 text-sm sm:text-lg shadow-lg animate-pulse font-display transition-all ${isPaused ? 'bg-rose-800 opacity-50 cursor-not-allowed shadow-none' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'}`}
                    >
                      <Square size={20} className="fill-white shrink-0" /> CHỐT SỐ [{digits - lockedCount}]
                    </button>
                    <button 
                      onClick={togglePause}
                      className={`flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-full text-white font-black py-4 px-2 sm:px-6 text-sm sm:text-lg shadow-lg font-display transition-all ${isPaused ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' : 'bg-slate-700 hover:bg-slate-600 shadow-slate-700/30 text-amber-500'}`}
                    >
                      {isPaused ? <><Play size={20} className="fill-white shrink-0" /> QUAY TIẾP</> : <><Pause size={20} className="fill-white shrink-0" /> TẠM DỪNG</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* History Panel */}
            <div className="flex-1 min-w-[280px] max-h-[450px] overflow-y-auto bg-slate-900/70 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col">
              <h3 className="mb-4 pb-3 text-center font-display text-xl font-black text-amber-400 uppercase border-b border-white/10">
                🏆 LỊCH SỬ TRÚNG GIẢI
              </h3>
              <div className="flex flex-col gap-0 overflow-y-auto min-w-0 pr-2 pb-2">
                {history.length === 0 && <div className="text-center text-slate-400 italic py-4">Chưa có kết quả...</div>}
                {history.map((h, i) => (
                  <div key={h.id} className="flex items-center justify-between border-b border-white/10 py-3 group">
                    <span className="font-bold text-lg truncate min-w-0 flex items-center gap-3">
                      <span className="text-slate-400 text-sm w-8">#{history.length - i}</span>
                      <span className="text-amber-400 font-display text-2xl tracking-widest">{h.result}</span>
                    </span>
                    <button 
                      onClick={() => deleteHistory(h.id)}
                      className="ml-2 rounded-lg p-2 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 sm:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="w-full text-center py-4 text-xs font-semibold text-white/50 tracking-wider relative z-10">Tác giả: Giuse Phạm Duy Ái, SDS</div>
      </div>
    </div>
  )
}
