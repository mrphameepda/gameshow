import HomeButton from '../../components/HomeButton';
// src/games/tao-quiz-do-vui/index.tsx
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, ArrowRight, Play, Pause, Lightbulb, Maximize2, Minimize2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { soundManager } from '@/core/soundManager'

type Level = 'easy' | 'medium' | 'hard'

type Question = {
  q: string
  correct: string
  options: string[]
}

const DEFAULT_QUIZ = {
  easy: "Thiên Chúa tạo dựng vũ trụ trong mấy ngày? | 6 ngày | 7 ngày | 5 ngày | 8 ngày\nAi là tổ phụ của dân Israel? | Abraham | Môsê | Đavít | Giuse",
  medium: "Ai là người đã dẫn dắt dân Israel ra khỏi Ai Cập? | Môsê | Giôsuê | Abraham | Aaron",
  hard: "Vị tiên tri nào đã bị quăng vào hang sư tử? | Đanien | Isaia | Giêrêmia | Êdêkien"
}

export default function TaoQuizDoVuiGame() {
  const [quizData, setQuizData] = useState<{ [key in Level]: string }>(DEFAULT_QUIZ)
  const [currentLevel, setCurrentLevel] = useState<Level>('easy')
  const [bgColor, setBgColor] = useState('#1e3c72')
  const [useSound, setUseSound] = useState(true)
  const [useTimer, setUseTimer] = useState(true)

  const [isPlaying, setIsPlaying] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  
  const [timerValue, setTimerValue] = useState(30)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    soundManager.register('quiz', 'correct', '/sounds/quiz-master/correct.mp3')
    soundManager.register('quiz', 'fail', '/sounds/quiz-master/fail.mp3')
    soundManager.register('quiz', 'tick', '/sounds/quiz-master/tick.mp3', true)

    const saved = localStorage.getItem('gl_quiz_data')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.easy !== undefined) setQuizData(parsed)
      } catch (e) {}
    }

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      stopTimerOnly()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gl_quiz_data', JSON.stringify(quizData))
  }, [quizData])

  const handleDataChange = (val: string) => {
    setQuizData(prev => ({ ...prev, [currentLevel]: val }))
  }

  const startQuiz = () => {
    const raw = quizData[currentLevel].trim()
    if (!raw) {
      alert("Chưa có dữ liệu!")
      return
    }
    const parsedQuestions = raw.split('\n').filter(l => l.trim()).map(line => {
      const parts = line.split('|').map(p => p.trim())
      return { q: parts[0], correct: parts[1], options: parts.slice(1) }
    })
    
    if (parsedQuestions.length === 0) return

    setQuestions(parsedQuestions)
    setCurrentIndex(0)
    setIsPlaying(true)
    loadQuestion(parsedQuestions[0])
  }

  const loadQuestion = (q: Question) => {
    setShuffledOptions([...q.options].sort(() => Math.random() - 0.5))
    setSelectedOption(null)
    setShowAnswer(false)
    resetTimer()
  }

  const stopTimerOnly = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    soundManager.stop('quiz', 'tick')
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    stopTimerOnly()
    setTimerValue(30)
  }

  const toggleTimer = () => {
    if (!useTimer) return
    if (isTimerRunning) {
      stopTimerOnly()
    } else {
      if (useSound) soundManager.play('quiz', 'tick')
      setIsTimerRunning(true)
      timerIntervalRef.current = setInterval(() => {
        setTimerValue(prev => {
          if (prev <= 1) {
            stopTimerOnly()
            if (useSound) soundManager.play('quiz', 'fail')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const handleOptionClick = (opt: string) => {
    if (selectedOption || showAnswer) return // already answered
    stopTimerOnly()
    setSelectedOption(opt)
    
    if (opt === questions[currentIndex].correct) {
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.8 } })
      if (useSound) soundManager.play('quiz', 'correct')
    } else {
      if (useSound) soundManager.play('quiz', 'fail')
    }
  }

  const handleShowAnswer = () => {
    stopTimerOnly()
    setShowAnswer(true)
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      loadQuestion(questions[nextIdx])
    }
  }

  const prevQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1
      setCurrentIndex(prevIdx)
      loadQuestion(questions[prevIdx])
    }
  }

  const exitQuiz = () => {
    stopTimerOnly()
    setIsPlaying(false)
  }

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen font-sans w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 relative`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute top-4 left-4 z-50">
        <HomeButton confirmExit={isPlaying} />
      </div>

      <div className={`relative flex flex-col items-center w-full ${isFullscreen ? 'max-w-none h-full justify-center' : 'max-w-5xl rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] bg-white/5 p-4'}`}>
        
        {!isPlaying ? (
          // Admin Panel
          <div className="w-full bg-white p-6 sm:p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <h1 className="font-display text-center text-blue-600 mb-6 text-[clamp(18px,4vw,32px)]">
              QUIZ MASTER PRO
            </h1>
            
            <div className="flex w-full mb-4">
              {(['easy', 'medium', 'hard'] as Level[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setCurrentLevel(lvl)}
                  className={`flex-1 p-3 text-center font-extrabold text-[13px] rounded-t-xl transition-colors ${
                    currentLevel === lvl ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {lvl === 'easy' ? 'DỄ' : lvl === 'medium' ? 'TRUNG BÌNH' : 'KHÓ'}
                </button>
              ))}
            </div>

            <textarea
              value={quizData[currentLevel]}
              onChange={(e) => handleDataChange(e.target.value)}
              placeholder="Câu hỏi | Đáp án đúng | Sai 1 | Sai 2 | Sai 3"
              className="w-full h-56 p-4 border-4 border-gray-200 rounded-xl text-[14px] text-gray-800 outline-none focus:border-blue-400 font-mono mb-4 resize-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-[13px] text-gray-700 font-bold bg-gray-50 p-4 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={useSound} onChange={e => setUseSound(e.target.checked)} className="w-4 h-4 accent-blue-600" /> Âm thanh
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={useTimer} onChange={e => setUseTimer(e.target.checked)} className="w-4 h-4 accent-blue-600" /> Đồng hồ
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                Nền: <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none p-0" />
              </label>
            </div>

            <div className="flex gap-4">
              <Link to="/" className="flex items-center justify-center p-4 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-colors text-gray-600">
                <Home size={24} />
              </Link>
              <button 
                onClick={startQuiz}
                className="flex-1 p-4 rounded-2xl border-none bg-emerald-600 text-white font-display text-xl cursor-pointer shadow-[0_6px_0_#1e8449] active:translate-y-1 active:shadow-[0_2px_0_#1e8449] transition-all hover:bg-emerald-500"
              >
                🚀 CHƠI NGAY
              </button>
            </div>
          </div>
        ) : (
          // Quiz Stage
          <div className="w-full flex-1 flex flex-col items-center justify-between p-4 relative min-h-[550px]">
            {useTimer && (
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 font-display text-[clamp(40px,12vw,80px)] text-yellow-400 z-50 drop-shadow-[3px_3px_0_rgba(0,0,0,1)] ${timerValue <= 5 && timerValue > 0 && isTimerRunning ? 'animate-pulse text-red-500 drop-shadow-none' : ''}`}>
                {timerValue}
              </div>
            )}

            <div className="w-full flex-1 flex flex-col justify-center items-center mt-20 mb-8">
              <h2 className="text-[clamp(20px,4.5vw,45px)] font-black text-yellow-300 drop-shadow-[2px_2px_0_#000,0_5px_10px_rgba(0,0,0,0.5)] mb-8 text-center max-w-4xl leading-snug">
                {currentIndex + 1}. {questions[currentIndex]?.q}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
                {shuffledOptions.map((opt, i) => {
                  const isCorrect = opt === questions[currentIndex].correct
                  const isSelected = opt === selectedOption
                  
                  let btnClass = "bg-white text-gray-900 shadow-[0_8px_0_#bdc3c7]"
                  if (showAnswer) {
                    if (isCorrect) btnClass = "bg-emerald-600 text-white shadow-[0_8px_0_#1e8449]"
                  } else if (isSelected) {
                    if (isCorrect) btnClass = "bg-emerald-600 text-white shadow-[0_8px_0_#1e8449]"
                    else btnClass = "bg-red-600 text-white shadow-[0_8px_0_#943126]"
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionClick(opt)}
                      className={`break-words p-5 rounded-2xl text-[clamp(16px,2.5vw,26px)] font-extrabold transition-all duration-200 active:translate-y-1 active:shadow-[0_4px_0_transparent] ${btnClass}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-2 bg-white/95 p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[3px] border-blue-600 max-w-4xl w-full z-50">
              <button onClick={exitQuiz} className="flex flex-col items-center justify-center gap-1 min-w-[60px] sm:min-w-[75px] p-2 sm:p-2.5 rounded-xl bg-slate-800 text-white font-bold hover:scale-95 transition-transform">
                <Home size={20} /> <span className="text-[10px] sm:text-xs">Thoát</span>
              </button>
              <button onClick={prevQuestion} className="flex flex-col items-center justify-center gap-1 min-w-[60px] sm:min-w-[75px] p-2 sm:p-2.5 rounded-xl bg-slate-800 text-white font-bold hover:scale-95 transition-transform">
                <ArrowLeft size={20} /> <span className="text-[10px] sm:text-xs">Trước</span>
              </button>
              
              {useTimer && (
                <button onClick={toggleTimer} className="flex flex-col items-center justify-center gap-1 min-w-[60px] sm:min-w-[75px] p-2 sm:p-2.5 rounded-xl bg-orange-500 text-white font-bold hover:scale-95 transition-transform">
                  {isTimerRunning ? <Pause size={20} /> : <Play size={20} />} 
                  <span className="text-[10px] sm:text-xs">{isTimerRunning ? 'Dừng' : 'Bắt đầu'}</span>
                </button>
              )}

              <button onClick={handleShowAnswer} className="flex flex-col items-center justify-center gap-1 min-w-[60px] sm:min-w-[75px] p-2 sm:p-2.5 rounded-xl bg-yellow-400 text-black font-bold hover:scale-95 transition-transform">
                <Lightbulb size={20} /> <span className="text-[10px] sm:text-xs">Đáp án</span>
              </button>
              
              <button onClick={nextQuestion} className="flex flex-col items-center justify-center gap-1 min-w-[60px] sm:min-w-[75px] p-2 sm:p-2.5 rounded-xl bg-slate-800 text-white font-bold hover:scale-95 transition-transform">
                <ArrowRight size={20} /> <span className="text-[10px] sm:text-xs">Tiếp</span>
              </button>

              <button onClick={toggleFullScreen} className="flex flex-col items-center justify-center gap-1 min-w-[60px] sm:min-w-[75px] p-2 sm:p-2.5 rounded-xl bg-blue-600 text-white font-bold hover:scale-95 transition-transform ml-auto">
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />} 
                <span className="text-[10px] sm:text-xs">Toàn màn</span>
              </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  )
}
