import { useEffect, useRef, useState, useCallback } from 'react'
import { Eye, Timer, Maximize2, Minimize2, HelpCircle } from 'lucide-react'
import type { QuizCategory } from '../types'
import { CATEGORY_LABELS, TIMER_SECONDS } from '../types'
import type { BaseQuestion } from '@/types/game'
import { questionRegistry } from '@/core/questionRegistry'
import { playSound, stopSound } from '../index'

interface QuizControlProps {
  projectorMode: boolean
  onToggleProjector: () => void
  onOpenGuide: () => void
  activeCount: number
  onOpenDrawer: () => void
}

export function QuizControl({ 
  projectorMode, 
  onToggleProjector, 
  onOpenGuide,
  activeCount,
  onOpenDrawer
}: QuizControlProps) {
  const [currentQ, setCurrentQ] = useState<BaseQuestion | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [isRunning, setIsRunning] = useState(false)
  const [suggestion, setSuggestion] = useState('READY!')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  const usedIds = useRef<Map<QuizCategory, Set<string>>>(new Map())

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const loadQuestion = useCallback((type: QuizCategory) => {
    if (!usedIds.current.has(type)) usedIds.current.set(type, new Set())
    const used = usedIds.current.get(type)!

    let q = questionRegistry.getRandom('rung-chuong-vang', type, used)
    if (!q) {
      used.clear()
      q = questionRegistry.getRandom('rung-chuong-vang', type, used)
    }
    if (!q) return

    used.add(q.id)
    clearTimer()
    setIsRunning(false)
    setShowAnswer(false)
    setTimeLeft(TIMER_SECONDS)
    setCurrentQ(q)
    setSuggestion(`${CATEGORY_LABELS[type]} #${used.size}`)
    playSound('click')
  }, [clearTimer])

  const startTimer = useCallback(() => {
    if (!currentQ || isRunning) return
    setIsRunning(true)
    playSound('tick', true)

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer()
          setIsRunning(false)
          stopSound('tick')
          playSound('end')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [currentQ, isRunning, clearTimer])

  const revealAnswer = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setShowAnswer(true)
    stopSound('tick')
    playSound('in')
  }, [clearTimer])

  useEffect(() => () => clearTimer(), [clearTimer])

  const progress = timeLeft / TIMER_SECONDS
  const isDanger = timeLeft <= 5
  const optionLetters = ['A', 'B', 'C', 'D']

  const glassStyle = "backdrop-blur-2xl backdrop-saturate-150 bg-slate-900/60 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.25)]"
  
  return (
    <div className={projectorMode ? "fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center px-[5vw] py-[5vh] font-display" : "relative font-display h-full flex flex-col"}>
      
      {/* KHU VỰC THI ĐẤU CHÍNH */}
      <div className={`w-full bg-white/15 backdrop-blur-xl border border-white/30 text-white shadow-2xl rounded-2xl p-4 md:p-6 lg:p-8 flex-1 flex flex-col relative z-10`}>
        
        {/* Header: Guide & Suggestion */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          {!projectorMode && (
            <button
              onClick={onOpenGuide}
              className="rounded-full bg-slate-800 px-3 py-1.5 lg:px-4 lg:py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 mr-2 flex items-center gap-1"
            >
              <HelpCircle size={14} /> <span className="hidden sm:inline">HD</span>
            </button>
          )}
          <span className="font-bold text-emerald-400 tracking-wider flex-1 text-xs sm:text-sm md:text-base truncate pr-2">
            {suggestion !== 'READY!' ? suggestion : 'Mời chọn bộ...'}
          </span>
          <div className="flex flex-col items-end shrink-0">
            <span className={`text-3xl md:text-4xl lg:text-5xl font-black tabular-nums ${isDanger ? 'text-rose-500' : 'text-amber-500'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="mb-4 lg:mb-6 h-2 lg:h-3 w-full overflow-hidden rounded-full border border-slate-700 bg-slate-950 shadow-inner shrink-0">
          <div
            className="h-full transition-all duration-1000"
            style={{
              width: `${progress * 100}%`,
              background: timeLeft <= 5 ? '#f43f5e' : timeLeft <= 10 ? '#f59e0b' : '#34d399',
              animation: isDanger && isRunning ? 'danger-blink 0.5s infinite' : 'none',
            }}
          />
        </div>

        {/* Question Text */}
        <div className="flex-1 flex items-center justify-center min-h-[100px] lg:min-h-[150px] mb-4 lg:mb-6 shrink-0">
          <p className={`text-amber-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-black text-center ${projectorMode ? 'leading-snug text-5xl md:text-6xl lg:text-7xl mb-8' : 'text-xl md:text-2xl lg:text-4xl'}`}>
            {currentQ ? currentQ.q : 'Mời Giám thị chọn bộ câu hỏi!'}
          </p>
        </div>

        {/* Options */}
        {currentQ && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 lg:gap-4 shrink-0">
            {currentQ.options.map((opt, i) => {
              const isCorrect = opt === currentQ.correct
              const highlighted = showAnswer && isCorrect
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 lg:gap-4 transition-all
                    ${highlighted 
                      ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.6)] animate-pulse rounded-2xl p-3.5 md:p-4' 
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 md:p-4 shadow-xl hover:bg-white/15'
                    }
                  `}
                  style={projectorMode ? { fontSize: '2rem', padding: '1.5rem' } : {}}
                >
                  <span className={`flex-shrink-0 flex items-center justify-center rounded-full shadow-md ${projectorMode ? 'w-14 h-14 text-2xl font-black' : 'w-8 h-8 lg:w-10 lg:h-10 text-sm lg:text-lg font-black'} 
                    ${highlighted ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}
                  `}>
                    {optionLetters[i]}
                  </span>
                  <span className={`font-bold ${projectorMode ? '' : 'text-sm lg:text-lg'} ${highlighted ? '' : 'text-white'}`}>
                    {opt}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* FLOATING CONTROLS */}
      <div className={`mt-4 lg:mt-6 space-y-4 w-full flex flex-col items-center ${projectorMode ? 'w-full max-w-4xl' : ''}`}>
        
        {/* Floating Category Pills */}
        <div className={`p-1.5 lg:p-2 rounded-full flex flex-wrap justify-center gap-1.5 lg:gap-2 ${glassStyle}`}>
          {(Object.keys(CATEGORY_LABELS) as QuizCategory[]).map(type => {
            const isSelected = suggestion.startsWith(CATEGORY_LABELS[type])
            return (
              <button
                key={type}
                onClick={() => loadQuestion(type)}
                className={`rounded-full px-3 py-1.5 lg:px-5 lg:py-2.5 text-xs lg:text-sm font-bold transition-all duration-300 ${
                  isSelected 
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {CATEGORY_LABELS[type]}
              </button>
            )
          })}
        </div>

        {/* Floating Action Toolbar - Desktop */}
        <div className={`hidden lg:flex p-2 rounded-full justify-center gap-2 w-full max-w-lg ${glassStyle}`}>
          <button
            onClick={startTimer}
            disabled={!currentQ || isRunning}
            className="flex-1 flex justify-center items-center gap-2 py-3 rounded-full font-bold text-slate-100 hover:bg-slate-800/60 disabled:opacity-50 transition-colors"
          >
            <Timer size={18} /> <span>Chạy giờ</span>
          </button>
          <button
            onClick={revealAnswer}
            disabled={!currentQ}
            className="flex-1 flex justify-center items-center gap-2 py-3 rounded-full bg-amber-400 font-black text-slate-950 shadow-lg shadow-amber-400/20 hover:bg-amber-300 hover:shadow-amber-400/40 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            <Eye size={18} /> <span>Đáp án</span>
          </button>
          <button
            onClick={onToggleProjector}
            className="flex-[0.8] flex justify-center items-center gap-2 py-3 rounded-full font-bold text-slate-100 hover:bg-slate-800/60 transition-colors"
            title={projectorMode ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {projectorMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
        
        {/* Mobile Action Dock (4 buttons) */}
        {!projectorMode && (
          <div className="grid grid-cols-4 gap-1.5 w-full bg-slate-900/80 backdrop-blur-2xl border border-white/15 p-1.5 rounded-2xl shadow-2xl lg:hidden">
            <button
              onClick={startTimer}
              disabled={!currentQ || isRunning}
              className="py-2.5 px-1 text-xs md:text-sm font-bold rounded-xl text-center transition-all bg-blue-600/80 hover:bg-blue-500 text-white disabled:opacity-50"
            >
              Chạy giờ
            </button>
            <button
              onClick={revealAnswer}
              disabled={!currentQ}
              className="py-2.5 px-1 text-xs md:text-sm font-black rounded-xl text-center transition-all bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md disabled:opacity-50"
            >
              Đáp án
            </button>
            <button
              onClick={onToggleProjector}
              className="py-2.5 px-1 text-xs md:text-sm font-semibold rounded-xl text-center transition-all bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10"
            >
              Phóng to
            </button>
            <button
              onClick={onOpenDrawer}
              className="py-2.5 px-1 text-xs md:text-sm font-black rounded-xl text-center transition-all bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 truncate"
            >
              Thí sinh ({activeCount})
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.8} }
        @keyframes danger-blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  )
}
