import HomeButton from '../../components/HomeButton';
import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { Maximize, Minimize, HelpCircle, Play, RefreshCw, SkipForward, Eye } from 'lucide-react'
import { CHIEC_NON_QUESTIONS } from '../../data/questionBank';
import QuestionSelectorModal from '../../components/QuestionSelectorModal';
import { questionService } from '../../services/questionService';

// --- CONSTANTS ---

const WHEEL_SEGMENTS = ["100", "500", "MẤT LƯỢT", "200", "MAY MẮN", "400", "CHIA ĐÔI", "300", "THÊM LƯỢT", "PHẠT", "50", "250", "100", "50", "MẤT LƯỢT"]
const WHEEL_COLORS = ["#1abc9c", "#3498db", "#e74c3c", "#f1c40f", "#9b59b6", "#e67e22", "#95a5a6", "#2ecc71", "#34495e", "#ff3d00", "#795548", "#8e44ad", "#16a085", "#d35400", "#c0392b"]

const spinAudio = new Audio('/sounds/chiec-non-ky-dieu/spin.mp3')
const tickAudio = new Audio('/sounds/chiec-non-ky-dieu/tick.mp3')
const winAudio = new Audio('/sounds/chiec-non-ky-dieu/win.mp3')
const clickAudio = new Audio('/sounds/chiec-non-ky-dieu/click.wav')
clickAudio.volume = 0.4

const playClick = () => {
  clickAudio.currentTime = 0
  clickAudio.play().catch(() => {})
}

const playSound = (type: 'spin' | 'tick' | 'win', loop = false) => {
  try {
    if (type === 'spin') {
      spinAudio.loop = loop
      spinAudio.currentTime = 0
      spinAudio.play().catch(e => console.log(e))
    } else if (type === 'tick') {
      tickAudio.loop = loop
      tickAudio.currentTime = 0
      tickAudio.play().catch(e => console.log(e))
    } else if (type === 'win') {
      winAudio.currentTime = 0
      winAudio.play().catch(e => console.log(e))
    }
  } catch (err) {
    console.log(err)
  }
}

const stopSound = (type: 'tick' | 'spin') => {
  try {
    if (type === 'tick') {
      tickAudio.pause()
      tickAudio.currentTime = 0
    }
    if (type === 'spin') {
      spinAudio.pause()
      spinAudio.currentTime = 0
    }
  } catch(e) {}
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

function normalizeChar(c: string) {
  return c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/Đ/g, "D").toUpperCase()
}

export default function ChiecNonKyDieu() {
  // State
  const [teams, setTeams] = useState<{name: string, score: number}[]>([])
  const [curTeamIdx, setCurTeamIdx] = useState(0)
  const [round, setRound] = useState(1)
  const [curQ, setCurQ] = useState<any>(null)
  const [gameQuestions, setGameQuestions] = useState(CHIEC_NON_QUESTIONS)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  
  // UI
  const [appState, setAppState] = useState<'setup' | 'playing'>('setup')
  const [setupMode, setSetupMode] = useState<'none' | 'team'>('none')
  const [teamCount, setTeamCount] = useState(2)
  const [teamNames, setTeamNames] = useState(['Đội 1', 'Đội 2', 'Đội 3', 'Đội 4'])
  const [showHandbook, setShowHandbook] = useState(false)
  const [projectorMode, setProjectorMode] = useState(false)
  
  // Board
  const [revealedChars, setRevealedChars] = useState<boolean[]>([])
  const [usedKeys, setUsedKeys] = useState<string[]>([])
  const [canPick, setCanPick] = useState(false)
  const [isGiftDouble, setIsGiftDouble] = useState(false)
  const [extraTurn, setExtraTurn] = useState(false)
  
  // Wheel
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastRes, setLastRes] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMsg, setModalMsg] = useState('')
  const [isGiftMode, setIsGiftMode] = useState(false)
  
  // Timer
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  // --- DRAW WHEEL ---
  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, 500, 500)
    const slice = (Math.PI * 2) / WHEEL_SEGMENTS.length
    
    for (let i = 0; i < WHEEL_SEGMENTS.length; i++) {
      const txt = WHEEL_SEGMENTS[i]
      ctx.fillStyle = WHEEL_COLORS[i]
      ctx.beginPath()
      ctx.moveTo(250, 250)
      ctx.arc(250, 250, 250, i * slice, (i + 1) * slice)
      ctx.fill()
      
      ctx.save()
      ctx.translate(250, 250)
      ctx.rotate(i * slice + slice / 2)
      ctx.fillStyle = "#fff"
      ctx.textAlign = "right"
      ctx.font = "bold 20px 'Be Vietnam Pro', sans-serif"
      ctx.fillText(txt, 230, 8)
      ctx.restore()
    }

    // Center hub
    ctx.beginPath()
    ctx.arc(250, 250, 35, 0, Math.PI * 2)
    ctx.fillStyle = '#f59e0b'
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#fff'
    ctx.stroke()
  }

  // Redraw when entering 'playing' state to ensure canvas is ready
  useEffect(() => {
    if (appState === 'playing') {
      setTimeout(() => {
        drawWheel()
        if (canvasRef.current) {
          canvasRef.current.style.transform = `rotate(${rotationRef.current}deg)`
        }
      }, 50)
    }
  }, [appState])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      spinAudio.pause()
      spinAudio.currentTime = 0
      tickAudio.pause()
      tickAudio.currentTime = 0
      winAudio.pause()
      winAudio.currentTime = 0
    }
  }, [])

  // --- LOGIC ---
  const initGame = (mode: 'single' | 'team') => {
    playClick()
    if (mode === 'single') {
      setTeams([{name: "Người chơi", score: 0}])
    } else {
      setTeams(teamNames.slice(0, teamCount).map(n => ({name: n.trim().slice(0, 25) || "Đội", score: 0})))
    }
    setAppState('playing')
    loadQuest(1)
  }

  const loadQuest = (r: number) => {
    const pool = gameQuestions
    if (pool.length === 0) return;
    const q = pool[(r - 1) % pool.length]
    setCurQ(q)
    setRound(r)
    setRevealedChars(Array(q.a.length).fill(false))
    setUsedKeys([])
    setCanPick(false)
    setIsGiftDouble(false)
    setExtraTurn(false)
    resetTimerToWait()
  }

  const nextTurn = () => {
    setIsGiftDouble(false)
    if (extraTurn) {
      setExtraTurn(false)
      // They get to keep their turn!
      resetTimerToWait()
      setCanPick(false)
      return
    }
    setCurTeamIdx(prev => (prev + 1) % teams.length)
    resetTimerToWait()
    setCanPick(false)
  }

  const resetTimerToWait = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsTimerRunning(false)
    setTimeLeft(30)
    stopSound('tick')
  }

  const startTimer = () => {
    playClick()
    setIsTimerRunning(true)
    setTimeLeft(30)
    playSound('tick', true)
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsTimerRunning(false)
          stopSound('tick')
          setTimeout(nextTurn, 1000)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const spinWheel = () => {
    if (isSpinning || canPick || showModal) return
    playClick()
    setIsSpinning(true)
    resetTimerToWait()
    playSound('spin')
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const extraSpins = Math.floor(Math.random() * 5) + 6
    const targetRotation = rotationRef.current + (extraSpins * 360) + Math.floor(Math.random() * 360)
    rotationRef.current = targetRotation

    canvas.style.transition = 'transform 4s cubic-bezier(0.15, 0.85, 0.3, 1)'
    canvas.style.transform = `rotate(${targetRotation}deg)`

    setTimeout(() => {
      setIsSpinning(false)
      const sliceAngle = 360 / WHEEL_SEGMENTS.length
      const normalizedRot = (targetRotation % 360)
      const idx = Math.floor(((270 - normalizedRot + 360) % 360) / sliceAngle)
      const res = WHEEL_SEGMENTS[idx]
      setLastRes(res)
      
      setModalTitle("KẾT QUẢ")
      if (res === "MAY MẮN") {
        setModalMsg("CHỌN HỘP QUÀ BÍ MẬT!")
        setIsGiftMode(true)
      } else {
        setModalMsg(`BẠN VÀO Ô: ${res}`)
        setIsGiftMode(false)
      }
      setShowModal(true)
    }, 4000)
  }

  const confirmResult = () => {
    playClick()
    setShowModal(false)
    if (lastRes === "MẤT LƯỢT" || lastRes === "PHẠT" || lastRes === "CHIA ĐÔI") {
      if (lastRes === "CHIA ĐÔI") {
        setTeams(prev => {
          const arr = [...prev]
          arr[curTeamIdx].score = Math.floor(arr[curTeamIdx].score / 2)
          return arr
        })
      }
      nextTurn()
    } else {
      // Regardless of what else (even MAY MẮN), we unlock the keyboard
      setCanPick(true)
      if (lastRes === "THÊM LƯỢT") {
        setExtraTurn(true)
      }
    }
  }

  const pickGift = () => {
    playClick()
    const r = ["X2 ĐIỂM", "+100 ĐIỂM", "THÊM LƯỢT"][Math.floor(Math.random()*3)]
    
    if (r === "X2 ĐIỂM") {
      setIsGiftDouble(true)
    } else if (r === "+100 ĐIỂM") {
      setTeams(prev => {
        const arr = [...prev]
        arr[curTeamIdx].score += 100
        return arr
      })
    } else if (r === "THÊM LƯỢT") {
      setExtraTurn(true)
    }
    
    setModalMsg(`QUÀ CỦA BẠN: ${r}`)
    setIsGiftMode(false)
  }

  const pickLetter = (c: string) => {
    if (!canPick || usedKeys.includes(c)) return
    playClick()
    
    setUsedKeys(prev => [...prev, c])
    setCanPick(false)
    resetTimerToWait()
    
    let count = 0
    const newRevealed = [...revealedChars]
    const targetC = normalizeChar(c)
    
    const ansChars = curQ.a.split('')
    ansChars.forEach((ch: string, idx: number) => {
      if (normalizeChar(ch) === targetC && !newRevealed[idx]) {
        newRevealed[idx] = true
        count++
      }
    })
    
    setRevealedChars(newRevealed)
    
    if (count > 0) {
      const spinPoint = parseInt(lastRes || '0')
      
      setTeams(prev => {
        const arr = [...prev]
        if (isGiftDouble) {
          arr[curTeamIdx].score = arr[curTeamIdx].score * 2
        }
        if (!isNaN(spinPoint)) {
          arr[curTeamIdx].score += (spinPoint * count)
        }
        return arr
      })
      setIsGiftDouble(false)
      
      // Check win
      let isWin = true
      ansChars.forEach((ch: string, idx: number) => {
        if (ch !== " " && !newRevealed[idx]) isWin = false
      })
      
      if (isWin) {
        playSound('win')
        confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } })
        setTimeout(() => alert("🎉 THẮNG VÒNG NÀY!"), 500)
      }
    } else {
      setIsGiftDouble(false)
      nextTurn()
    }
  }

  const showAnswer = () => {
    playClick()
    setRevealedChars(Array(curQ.a.length).fill(true))
  }

  const handleNextRound = () => {
    playClick()
    const nextR = round < 4 ? round + 1 : 1
    loadQuest(nextR)
  }
  
  const handleSwapQuest = () => {
    playClick()
    loadQuest(round)
  }

  const toggleFullscreen = () => {
    playClick()
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err))
      setProjectorMode(true)
    } else {
      document.exitFullscreen()
      setProjectorMode(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-display bg-gradient-to-br from-slate-950 via-[#0b1329] to-indigo-950 text-slate-100 overflow-hidden">
      {/* HEADER */}
      <header className="p-2 sm:p-4 flex items-center justify-between z-10 relative">
        <HomeButton confirmExit={appState === 'playing'} />
        {/* CENTER TIMER ON MOBILE/ALL */}
        {appState === 'playing' && (
          <div className="flex items-center gap-2 animate-fade-in-up">
             <div className="flex items-center gap-1 bg-rose-500/20 border border-rose-400/40 text-rose-300 px-3 py-1 rounded-full font-black text-sm md:text-base shadow-inner">
               ⏱️ <span>{timeLeft}s</span>
             </div>
             {canPick && !isTimerRunning && (
                <button 
                  onClick={startTimer}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all hover:scale-105"
                >
                  <Play size={14} /> <span className="hidden sm:inline">CHẠY GIỜ</span>
                </button>
             )}
          </div>
        )}

        <button 
          onClick={toggleFullscreen}
          className="rounded-full backdrop-blur-xl bg-slate-900/60 border border-white/15 shadow-md px-3 py-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-all"
        >
          {projectorMode ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </header>

      {/* SETUP SCREEN */}
      {appState === 'setup' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="font-black text-4xl sm:text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-600 mb-2 drop-shadow-lg text-center uppercase pt-4 pb-2 px-2 leading-tight md:leading-normal">
            Chiếc Nón Kỳ Diệu
          </h1>
          <p className="text-amber-200/80 mb-12 font-bold tracking-widest uppercase">Giuse Phạm Duy Ái, SDS</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={() => { playClick(); setIsSelectorOpen(true); }}
              className="px-8 py-4 rounded-2xl font-black text-xl bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/30 transition-transform hover:scale-105"
            >
              📚 BỘ CÂU HỎI
            </button>
            <button 
              onClick={() => initGame('single')}
              className="px-8 py-4 rounded-2xl font-black text-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-transform hover:scale-105"
            >
              CHƠI ĐƠN
            </button>
            <button 
              onClick={() => { playClick(); setSetupMode('team'); }}
              className="px-8 py-4 rounded-2xl font-black text-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-105"
            >
              CHƠI ĐỘI
            </button>
          </div>
          
          {setupMode === 'team' && (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 w-full max-w-md animate-fade-in-up">
              <h3 className="font-bold text-amber-400 text-center text-lg">NHẬP TÊN CÁC ĐỘI ({teamCount})</h3>
              <input type="range" min={2} max={4} value={teamCount} onChange={e => setTeamCount(parseInt(e.target.value))} className="w-full accent-amber-500 mb-2" />
              <div className="flex flex-col gap-2">
                {Array.from({length: teamCount}).map((_, i) => (
                  <input 
                    key={i}
                    type="text" 
                    value={teamNames[i]}
                    maxLength={25}
                    onChange={e => {
                      const arr = [...teamNames]
                      arr[i] = e.target.value
                      setTeamNames(arr)
                    }}
                    placeholder={`Tên Đội ${i+1}`}
                    className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500"
                  />
                ))}
              </div>
              <button 
                onClick={() => initGame('team')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-xl py-3 mt-2 shadow-lg shadow-emerald-600/30"
              >
                VÀO TRẬN ĐẤU
              </button>
            </div>
          )}

          <button 
            onClick={() => { playClick(); setShowHandbook(true); }}
            className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-bold"
          >
            <HelpCircle size={20} /> CẨM NĂNG TOÀN TẬP
          </button>
        </div>
      )}

      {/* MAIN GAME */}
      {appState === 'playing' && (
        <main className="flex-1 w-full max-w-7xl mx-auto p-2 sm:p-4 flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-8 items-start relative z-10 overflow-y-auto">
          
          {/* RIGHT COL (MOBILE TOP): SCORES & CONTROLS */}
          <div className="lg:col-span-4 h-full flex flex-col gap-3 sm:gap-6 order-1 lg:order-2 w-full shrink-0">
            
            {/* SCORES - Horizontal scroll on mobile */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-2xl lg:rounded-3xl p-3 sm:p-4 shadow-2xl w-full">
              <h3 className="font-bold text-amber-400 mb-2 sm:mb-4 text-center uppercase border-b border-white/10 pb-1 sm:pb-2 text-sm sm:text-base">ĐIỂM SỐ</h3>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide snap-x">
                {teams.map((t, i) => (
                  <div key={i} className={`snap-center shrink-0 min-w-[120px] lg:min-w-0 flex flex-col lg:flex-row lg:items-center justify-between p-2 lg:p-4 rounded-xl border-l-4 transition-all ${
                    i === curTeamIdx 
                      ? 'bg-blue-900/40 border-blue-500 shadow-inner ring-1 ring-blue-500/50' 
                      : 'bg-slate-800/50 border-slate-600'
                  }`}>
                    <span className={`font-bold text-xs lg:text-base truncate max-w-[100px] lg:max-w-[120px] ${i === curTeamIdx ? 'text-blue-400' : 'text-slate-300'}`}>{t.name}</span>
                    <span className="font-black text-lg lg:text-2xl text-amber-400">{t.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION DOCK (MOBILE HORIZONTAL, DESKTOP GRID) */}
            <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-full lg:rounded-3xl p-2 lg:p-4 shadow-2xl flex flex-row lg:grid lg:grid-cols-2 gap-2 justify-between lg:justify-stretch">
              <button onClick={showAnswer} className="flex-1 lg:col-span-2 flex items-center justify-center gap-1 sm:gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-2 rounded-full lg:rounded-xl transition-colors text-xs sm:text-sm shadow-md">
                <Eye size={16} /> <span className="hidden sm:inline">ĐÁP ÁN</span><span className="sm:hidden">MỞ Đ/A</span>
              </button>
              <button onClick={handleSwapQuest} className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-2 rounded-full lg:rounded-xl transition-colors text-xs sm:text-sm shadow-md">
                <RefreshCw size={14} /> <span className="hidden sm:inline">ĐỔI CÂU</span><span className="sm:hidden">ĐỔI</span>
              </button>
              <button onClick={handleNextRound} className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-full lg:rounded-xl transition-colors text-xs sm:text-sm shadow-md">
                <SkipForward size={14} /> <span className="hidden sm:inline">VÒNG TIẾP</span><span className="sm:hidden">TIẾP</span>
              </button>
            </div>
            
          </div>

          {/* LEFT COL (MOBILE BOTTOM): BOARD & WHEEL & KEYBOARD */}
          <div className="lg:col-span-8 h-full flex flex-col items-center gap-4 sm:gap-6 order-2 lg:order-1 w-full">
            
            {/* BOARD */}
            <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center">
              <div className="bg-amber-500 text-slate-950 font-black px-4 py-1 sm:px-6 sm:py-1.5 rounded-full text-xs sm:text-sm mb-3 sm:mb-4 tracking-widest uppercase">
                {['Khởi Động', 'Tăng Tốc', 'Về Đích', 'Đặc Biệt'][round-1]}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-4 sm:mb-6 max-w-2xl px-2">
                {curQ?.q}
              </div>
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                {curQ?.a.split('').map((c: string, i: number) => {
                  if (c === " ") return <div key={i} className="w-3 sm:w-6" />
                  const rev = revealedChars[i]
                  return (
                    <div 
                      key={i} 
                      className={`w-8 h-12 sm:w-12 sm:h-16 border-[1.5px] sm:border-2 flex items-center justify-center text-xl sm:text-3xl font-black rounded-lg sm:rounded-xl transition-all duration-500 ${
                        rev ? 'bg-blue-600 border-blue-400 text-white rotate-y-360 shadow-[0_0_15px_rgba(37,99,235,0.6)]' : 'bg-slate-800 border-slate-600 text-transparent'
                      }`}
                    >
                      {c}
                    </div>
                  )
                })}
              </div>
            </div>

            <button 
                onClick={spinWheel}
                disabled={isSpinning || canPick}
                className="w-full max-w-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl sm:text-2xl py-3 sm:py-4 rounded-full shadow-[0_8px_32px_0_rgba(245,158,11,0.4)] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                QUAY NÓN
            </button>

            {/* WHEEL */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] shrink-0">
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] sm:border-l-[15px] sm:border-r-[15px] border-t-[25px] sm:border-t-[35px] border-l-transparent border-r-transparent border-t-rose-500 z-50 drop-shadow-md"></div>
                <div className="w-full h-full rounded-full border-[6px] sm:border-[8px] border-white bg-white shadow-2xl overflow-hidden relative">
                  <canvas ref={canvasRef} width={500} height={500} className="w-full h-full object-contain" />
                </div>
                {/* GLASS OVERLAY TO MAKE IT LOOK LIKE A SPHERE */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* KEYBOARD */}
            <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-white/15 rounded-2xl lg:rounded-3xl p-3 sm:p-4 shadow-2xl">
              <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-1.5 sm:gap-2">
                {ALPHABET.map(c => (
                  <button
                    key={c}
                    onClick={() => pickLetter(c)}
                    disabled={!canPick || usedKeys.includes(c)}
                    className={`aspect-square flex items-center justify-center rounded-lg sm:rounded-xl font-black text-base sm:text-lg lg:text-xl transition-all ${
                      usedKeys.includes(c) 
                        ? 'bg-slate-800 text-slate-600 opacity-50' 
                        : canPick 
                          ? 'bg-slate-200 text-slate-900 hover:bg-white hover:scale-110 shadow-md cursor-pointer' 
                          : 'bg-slate-700 text-slate-400 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Add extra padding at bottom so user can scroll down easily on mobile */}
            <div className="h-10 lg:hidden"></div>
          </div>
          
        </main>
      )}

      {/* MODALS */}
      {showModal && (
        <div className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-black text-amber-400 mb-2 sm:mb-4">{modalTitle}</h2>
            <p className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8">{modalMsg}</p>
            
            {isGiftMode ? (
              <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                {[1,2,3].map(i => (
                  <button 
                    key={i} 
                    onClick={pickGift}
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 rounded-2xl shadow-lg border-2 border-rose-300 flex items-center justify-center text-2xl sm:text-3xl transition-transform hover:scale-110"
                  >
                    🎁
                  </button>
                ))}
              </div>
            ) : (
              <button 
                onClick={confirmResult}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl shadow-lg"
              >
                XÁC NHẬN
              </button>
            )}
          </div>
        </div>
      )}

      {/* HANDBOOK MODAL */}
      {showHandbook && (
        <div className="absolute inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col relative overflow-hidden shadow-2xl">
            <button 
              onClick={() => { playClick(); setShowHandbook(false); }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-lg hover:bg-rose-500 z-10"
            >
              ×
            </button>
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-thin text-slate-300">
              <h2 className="text-center text-amber-400 font-black text-2xl sm:text-3xl mb-4 sm:mb-6 uppercase">Cẩm Nang Toàn Tập</h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white border-l-4 border-amber-500 pl-3 mb-2">I. CHUẨN BỊ KỸ THUẬT (Dành cho Quản trò)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                    <li><b>Chế độ Máy chiếu:</b> Nhấn nút 📺 MÁY CHIẾU để tràn viền màn hình, ẩn công cụ trình duyệt.</li>
                    <li><b>Âm thanh:</b> Kiểm tra loa máy tính/hội trường.</li>
                    <li><b>Thiết lập Đội:</b> Chọn <b>Chơi Đơn (LUYỆN TẬP)</b> hoặc <b>Chơi Đội (2-4 đội)</b>.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white border-l-4 border-amber-500 pl-3 mb-2">II. TIẾN TRÌNH TRÒ CHƠI CHI TIẾT</h3>
                  <ul className="list-decimal pl-5 space-y-1 text-sm sm:text-base">
                    <li><b>Công bố câu hỏi:</b> Quản trò đọc to câu hỏi và gợi ý.</li>
                    <li><b>Vòng quay định mệnh:</b> Đội chơi nhấn <b>QUAY NÓN</b>.</li>
                    <li><b>Đoán chữ cái:</b> Nhấn <b>BẮT ĐẦU TÍNH GIỜ</b> (30s).</li>
                    <li><b>Giải ô chữ:</b> Đội chơi có quyền đoán toàn bộ từ khóa.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white border-l-4 border-amber-500 pl-3 mb-2">III. Ý NGHĨA CÁC Ô ĐẶC BIỆT</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full mt-2 border-collapse border border-slate-700 text-xs sm:text-sm min-w-[300px]">
                      <thead>
                        <tr className="bg-slate-800"><th className="border border-slate-700 p-2 text-left">Ô trên nón</th><th className="border border-slate-700 p-2 text-left">Tác động đến Đội chơi</th></tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-slate-700 p-2 font-bold text-amber-400">Số (50 - 500)</td><td className="border border-slate-700 p-2">Điểm nhận được cho mỗi chữ cái đoán đúng.</td></tr>
                        <tr><td className="border border-slate-700 p-2 font-bold text-amber-400">MAY MẮN</td><td className="border border-slate-700 p-2">Chọn 1 trong 3 hộp quà bí mật: X2 Điểm, +100 Điểm, Thêm 1 lượt quay.</td></tr>
                        <tr><td className="border border-slate-700 p-2 font-bold text-amber-400">MẤT LƯỢT / PHẠT</td><td className="border border-slate-700 p-2">Mất quyền điều khiển lượt này, chuyển sang đội sau.</td></tr>
                        <tr><td className="border border-slate-700 p-2 font-bold text-amber-400">CHIA ĐÔI</td><td className="border border-slate-700 p-2">Số điểm hiện tại bị giảm 50% ngay lập tức.</td></tr>
                        <tr><td className="border border-slate-700 p-2 font-bold text-amber-400">THÊM LƯỢT</td><td className="border border-slate-700 p-2">Vé thông hành không mất lượt dù đoán sai chữ cái.</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 text-center">
                <button onClick={() => { playClick(); setShowHandbook(false); }} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 sm:px-12 py-3 rounded-full shadow-lg text-sm sm:text-base">
                  XÁC NHẬN ĐÃ HIỂU
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* SELECTOR MODAL */}
      {isSelectorOpen && (
        <QuestionSelectorModal
          isOpen={isSelectorOpen}
          onClose={() => setIsSelectorOpen(false)}
          onApply={(qs) => {
            const formatted = questionService.getQuestionsForGame('chiec-non-ky-dieu', qs);
            setGameQuestions(formatted);
          }}
        />
      )}
    </div>
  )
}
