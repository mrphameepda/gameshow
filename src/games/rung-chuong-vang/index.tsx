import HomeButton from '../../components/HomeButton';
// src/games/rung-chuong-vang/index.tsx
import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { SetupScreen } from './components/SetupScreen'
import type { GuideTab } from './components/GuideModal'
import { GuideModal } from './components/GuideModal'
import { StadiumGrid } from './components/StadiumGrid'
import { QuizControl } from './components/QuizControl'
import { ActionFooter } from './components/ActionFooter'
import { storage } from '@/core/storage'

import { questionRegistry } from '@/core/questionRegistry'
import { rcvDefaultSet } from '@/data/questions/rung-chuong-vang/default-set'
import type { PlayerSlot, SavedRcvGame } from './types'
import QuestionSelectorModal from '@/components/QuestionSelectorModal'
import { questionService } from '@/services/questionService'

// Khởi tạo âm thanh trực tiếp (như user yêu cầu)
const tickAudio = new Audio('/sounds/rung-chuong-vang/tick.mp3')
const endAudio = new Audio('/sounds/rung-chuong-vang/end.mp3')
const inAudio = new Audio('/sounds/rung-chuong-vang/in.mp3')
const outAudio = new Audio('/sounds/rung-chuong-vang/out.mp3')
const clickAudio = new Audio('/sounds/rung-chuong-vang/click.wav')

export const playSound = (type: 'tick' | 'end' | 'in' | 'out' | 'bell' | 'wrong' | 'correct' | 'click', loop = false) => {
  try {
    if (type === 'tick') {
      tickAudio.loop = loop
      tickAudio.currentTime = 0
      tickAudio.play().catch(e => console.log(e))
    } else if (type === 'end' || type === 'wrong') {
      endAudio.currentTime = 0
      endAudio.play().catch(e => console.log(e))
    } else if (type === 'in' || type === 'correct' || type === 'bell') {
      inAudio.currentTime = 0
      inAudio.play().catch(e => console.log(e))
    } else if (type === 'out') {
      outAudio.currentTime = 0
      outAudio.play().catch(e => console.log(e))
    } else if (type === 'click') {
      clickAudio.currentTime = 0
      clickAudio.play().catch(e => console.log(e))
    }
  } catch (err) {
    console.log(err)
  }
}

export const stopSound = (type: 'tick') => {
  if (type === 'tick') {
    tickAudio.pause()
    tickAudio.currentTime = 0
  }
}
import { RCV_SAVE_KEY } from './types'

export default function RungChuongVangGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [players, setPlayers] = useState<PlayerSlot[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [projectorMode, setProjectorMode] = useState(false)
  const [guideTab, setGuideTab] = useState<GuideTab | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [savedGamePrompt, setSavedGamePrompt] = useState<SavedRcvGame | null>(null)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)

  // Initialization
  useEffect(() => {
    // 1. Đăng ký câu hỏi vào Registry nếu chưa có
    if (questionRegistry.count('rung-chuong-vang') === 0) {
      questionRegistry.register('rung-chuong-vang', rcvDefaultSet)
    }

    // Khôi phục state từ storage
    const saved = storage.get<SavedRcvGame>(RCV_SAVE_KEY)
    if (saved && saved.players.length > 0) {
      setSavedGamePrompt(saved)
    }

    return () => {
      stopSound('tick')
      tickAudio.pause(); tickAudio.currentTime = 0;
      endAudio.pause(); endAudio.currentTime = 0;
      inAudio.pause(); inAudio.currentTime = 0;
      outAudio.pause(); outAudio.currentTime = 0;
    }
  }, [])

  const handleRestore = () => {
    if (savedGamePrompt) {
      setPlayers(savedGamePrompt.players)
      setGameStarted(true)
      setSavedGamePrompt(null)
      playSound('click')
    }
  }

  const handleCreateNew = () => {
    storage.remove(RCV_SAVE_KEY)
    setSavedGamePrompt(null)
    playSound('click')
  }

  const persist = useCallback((ps: PlayerSlot[]) => {
    storage.set<SavedRcvGame>(RCV_SAVE_KEY, { players: ps, savedAt: Date.now() })
  }, [])

  const handleStart = useCallback((names: string[]) => {
    // Kích hoạt audio context
    playSound('click') // Trick to unlock audio context on mobile

    const ps: PlayerSlot[] = names.map((name, i) => ({
      id: `p-${i}`,
      name,
      out: false,
    }))
    setPlayers(ps)
    setSelectedId(null)
    setGameStarted(true)
    persist(ps)
  }, [persist])

  const handleSelect = useCallback((id: string) => {
    playSound('click')
    setSelectedId(prev => (prev === id ? null : id))
  }, [])

  const handleEliminate = useCallback(() => {
    if (!selectedId) return
    setPlayers(prev => {
      const updated = prev.map(p => p.id === selectedId ? { ...p, out: true } : p)
      persist(updated)
      return updated
    })
    playSound('out')
    setSelectedId(null)
  }, [selectedId, persist])

  const handleReinstate = useCallback(() => {
    if (!selectedId) return
    setPlayers(prev => {
      const updated = prev.map(p => p.id === selectedId ? { ...p, out: false } : p)
      persist(updated)
      return updated
    })
    playSound('in')
    setSelectedId(null)
  }, [selectedId, persist])

  const handleCelebrate = useCallback(() => {
    stopSound('tick')
    playSound('in')

    const duration = 4000
    const end = Date.now() + duration
    const colors = ['#facc15', '#f59e0b', '#fff', '#2196f3', '#ff5252']

    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const handleReset = useCallback(() => {
    if (!window.confirm('Bạn có chắc muốn LÀM MỚI GAME TOÀN BỘ?')) return
    stopSound('tick')
    storage.remove(RCV_SAVE_KEY)
    setPlayers([])
    setSelectedId(null)
    setGameStarted(false)
    setProjectorMode(false)
  }, [])

  if (!gameStarted) {
    if (savedGamePrompt) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950/80 p-4" style={{ backgroundImage: "url('/images/bk1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
          <div className="absolute top-4 left-4 z-50">
            <HomeButton confirmExit={gameStarted} />
          </div>

          <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-black text-amber-400">TÌM THẤY TRẬN ĐẤU CŨ</h2>
            <p className="mb-8 text-slate-300">Bạn có muốn tiếp tục trận đấu đang dở hay tạo một trận đấu hoàn toàn mới?</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleRestore} className="rounded-2xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-500 transition-colors">
                Khôi phục trận đấu ({savedGamePrompt.players.length} thí sinh)
              </button>
              <button onClick={handleCreateNew} className="rounded-2xl border border-rose-500/50 bg-rose-500/20 py-3 font-bold text-rose-300 hover:bg-rose-500/30 transition-colors">
                Bỏ qua, Tạo trận mới
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-slate-950/40 backdrop-blur-sm"
        style={{ backgroundImage: "url('/images/bk1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      >
        <div className="absolute top-4 left-4 z-50">
          <HomeButton confirmExit={false} />
        </div>
        <SetupScreen onStart={handleStart} onOpenGuide={setGuideTab} onOpenSelector={() => setIsSelectorOpen(true)} />
        {guideTab && <GuideModal tab={guideTab} onClose={() => setGuideTab(null)} />}
        {isSelectorOpen && (
          <QuestionSelectorModal 
            isOpen={isSelectorOpen} 
            onClose={() => setIsSelectorOpen(false)} 
            onApply={(qs) => {
              const formatted = questionService.getQuestionsForGame('rung-chuong-vang', qs)
              questionRegistry.register('rung-chuong-vang', formatted)
            }} 
          />
        )}
      </div>
    )
  }

  const activeCount = players.filter(p => !p.out).length
  const totalCount = players.length

  return (
    <div
      className="flex min-h-screen flex-col bg-slate-950/40 backdrop-blur-sm text-slate-100"
      style={{ backgroundImage: "url('/images/bk1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      <div className="absolute top-4 left-4 z-50">
        <HomeButton confirmExit={true} />
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {!projectorMode && (
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              <div className="flex items-center gap-3">
                <img src="/images/rcv-logo.png" alt="Logo" className="h-10 drop-shadow hidden sm:block" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                <h1 className="font-display text-xl sm:text-2xl font-black text-amber-500 shimmer-text drop-shadow-md">
                  🔔 Rung Chuông Vàng
                </h1>
              </div>
            </div>
            <button
              onClick={() => { playSound('click'); setGuideTab('huongdan'); }}
              className="rounded-full bg-slate-800 px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 shadow-md"
            >
              📖 Hướng dẫn
            </button>
          </header>
        )}

        <div className={`lg:grid lg:grid-cols-12 lg:gap-6 items-start ${projectorMode ? 'flex flex-col h-[90vh]' : ''}`}>

          {/* CỘT TRÁI - KHU VỰC THI ĐẤU */}
          <div className={`${projectorMode ? 'col-span-full w-full h-full' : 'lg:col-span-8'} transition-all duration-300`}>
            <QuizControl
              projectorMode={projectorMode}
              onToggleProjector={() => setProjectorMode(m => !m)}
              onOpenGuide={() => { playSound('click'); setGuideTab('huongdan'); }}
              activeCount={activeCount}
              onOpenDrawer={() => setIsDrawerOpen(true)}
            />
          </div>

          {/* CỘT PHẢI - QUẢN LÝ THÍ SINH (DESKTOP) */}
          {!projectorMode && (
            <div className="hidden lg:flex bg-slate-900 border border-slate-800 rounded-3xl p-5 flex-col h-[650px] shadow-2xl lg:col-span-4">
              <h2 className="text-lg font-black text-amber-500 pb-3 border-b border-slate-800 uppercase tracking-wide">
                👥 SÂN THI ĐẤU (Còn {activeCount}/{totalCount} thí sinh)
              </h2>

              <div className="flex-1 overflow-y-auto my-4 pr-1">
                <StadiumGrid players={players} selectedId={selectedId} onSelect={handleSelect} />
              </div>

              <div className="pt-3 border-t border-slate-800">
                <ActionFooter
                  selectedId={selectedId}
                  onEliminate={handleEliminate}
                  onReinstate={handleReinstate}
                  onCelebrate={handleCelebrate}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER BUTTON (LIQUID GLASS) - MOVED TO BOTTOM DOCK IN QUIZCONTROL */}

      {/* MOBILE DRAWER (BOTTOM SHEET) */}
      {!projectorMode && isDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex items-end lg:hidden motion-reduce:transition-none">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full h-[85vh] bg-slate-900 rounded-t-3xl p-5 flex flex-col shadow-2xl animate-slide-up border-t border-slate-700">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h2 className="text-lg font-black text-amber-500 uppercase tracking-wide">
                👥 SÂN THI ĐẤU (Còn {activeCount}/{totalCount})
              </h2>
              <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-full text-sm font-bold border border-slate-700">
                ✕ Đóng
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 pr-1">
              <StadiumGrid players={players} selectedId={selectedId} onSelect={handleSelect} />
            </div>

            <div className="pt-3 border-t border-slate-800">
              <ActionFooter
                selectedId={selectedId}
                onEliminate={handleEliminate}
                onReinstate={handleReinstate}
                onCelebrate={handleCelebrate}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      )}

      {guideTab && <GuideModal tab={guideTab} onClose={() => setGuideTab(null)} />}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}
