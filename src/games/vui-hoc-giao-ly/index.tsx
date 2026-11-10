import HomeButton from '../../components/HomeButton';
// src/games/vui-hoc-giao-ly/index.tsx
import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { vuiHocData, type VuiHocCategory, type VuiHocQuestion } from '@/data/questions/vui-hoc-giao-ly/questions'
import { saveToLeaderboard, subscribeToLeaderboard, type LeaderboardEntry } from '@/services/firebaseService'
import { soundManager } from '@/core/soundManager'
import { useAuth } from '@/contexts/AuthContext'
import GuestSaveScorePopup from '@/components/GuestSaveScorePopup'

// Utility to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

type GameState = 'form' | 'playing' | 'result'

export default function VuiHocGiaoLyGame() {
  const [gameState, setGameState] = useState<GameState>('form')
  const [playerInfo, setPlayerInfo] = useState<Partial<LeaderboardEntry>>({})
  const [quizList, setQuizList] = useState<VuiHocQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [saveStatus, setSaveStatus] = useState('Đang lưu kết quả...')
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((data) => {
      setLeaderboard(data)
    })
    return () => {
      unsubscribe()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startGame = (info: Partial<LeaderboardEntry>) => {
    setPlayerInfo(info)
    let questions: VuiHocQuestion[] = []
    
    if (info.level === 'tuy_chon') {
      const ts = shuffle(vuiHocData.them_suc).slice(0, 5)
      const sd = shuffle(vuiHocData.song_dao).slice(0, 5)
      questions = shuffle([...ts, ...sd])
    } else {
      questions = shuffle(vuiHocData[info.level as VuiHocCategory]).slice(0, 10)
    }
    
    setQuizList(questions)
    setCurrentIndex(0)
    setScore(0)
    setGameState('playing')
    soundManager.play('vui-hoc-giao-ly', 'silence') // Init audio context
    setupQuestion(questions[0])
  }

  const setupQuestion = (q: VuiHocQuestion) => {
    setShuffledOptions(shuffle(q.o))
    setTimeLeft(10)
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 4 && prev > 1) { // 3s, 2s, 1s
          soundManager.play('vui-hoc-giao-ly', 'tick')
        }
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleTimeOut()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleTimeOut = () => {
    soundManager.play('vui-hoc-giao-ly', 'wrong')
    nextQuestion(false)
  }

  const handleAnswer = (opt: string) => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    const isCorrect = opt === quizList[currentIndex].c
    if (isCorrect) {
      setScore(s => s + 1)
      soundManager.play('vui-hoc-giao-ly', 'correct')
    } else {
      soundManager.play('vui-hoc-giao-ly', 'wrong')
    }
    
    nextQuestion(isCorrect)
  }

  const nextQuestion = (wasCorrect: boolean) => {
    // Delay slightly to show answer state if needed, but per original HTML it goes immediately.
    const nextIdx = currentIndex + 1
    if (nextIdx >= quizList.length) {
      finishGame(score + (wasCorrect ? 1 : 0))
    } else {
      setCurrentIndex(nextIdx)
      setupQuestion(quizList[nextIdx])
    }
  }

  const { currentUser, saveUserScore } = useAuth()
  const [showGuestPopup, setShowGuestPopup] = useState(false)
  const [finalGameScore, setFinalGameScore] = useState(0)

  const finishGame = (finalScore: number) => {
    setGameState('result')
    setFinalGameScore(finalScore)
    soundManager.play('vui-hoc-giao-ly', 'end')
    
    if (finalScore >= 8) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    }

    const entry: LeaderboardEntry = {
      name: playerInfo.name || 'Unknown',
      diocese: playerInfo.diocese || '',
      parish: playerInfo.parish || '-',
      level: playerInfo.level || 'khai_tam',
      score: finalScore
    }

    saveToLeaderboard(entry).then((success) => {
      setSaveStatus(success ? "✅ Đã lưu thành công!" : "❌ Lỗi khi lưu kết quả")
    })

    // Save to user profile if logged in, otherwise show guest popup
    if (currentUser) {
      saveUserScore('vui-hoc-giao-ly', 'Đố Vui Giáo Lý', finalScore)
    } else {
      setTimeout(() => setShowGuestPopup(true), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a2a6c] font-sans text-gray-800 p-4 relative">
      <div className="absolute top-4 left-4 z-50">
        <HomeButton confirmExit={false} />
      </div>

      {showGuestPopup && (
        <GuestSaveScorePopup
          score={finalGameScore}
          gameId="vui-hoc-giao-ly"
          gameName="Đố Vui Giáo Lý"
          onClose={() => setShowGuestPopup(false)}
        />
      )}

      <div className="mx-auto w-full max-w-6xl">


        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-start">
          {/* Main Game Panel */}
          <div className="md:col-span-7 lg:col-span-8 rounded-[25px] border-4 border-white bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <h1 className="mb-6 bg-gradient-to-r from-[#ff5252] via-[#ffcc00] to-[#2ecc71] bg-clip-text text-center font-display text-3xl font-black text-transparent sm:text-5xl">
              VUI HỌC GIÁO LÝ
            </h1>

            {gameState === 'form' && (
              <GameForm onStart={startGame} />
            )}

            {gameState === 'playing' && (
              <div className="flex flex-col items-center">
                <h2 className="mb-6 text-center text-xl font-black text-slate-800 sm:text-2xl">
                  Câu {currentIndex + 1}/{quizList.length}: {quizList[currentIndex].q}
                </h2>
                
                <div className="w-full space-y-3">
                  {shuffledOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      className="w-full rounded-2xl border-b-4 border-slate-200 bg-white p-4 text-left text-lg font-black text-[#2c3e50] shadow-sm transition-all hover:translate-x-2 hover:border-[#3498db] hover:bg-[#f0f8ff]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-[#ff5252] transition-all duration-1000 ease-linear"
                    style={{ width: `${(timeLeft / 10) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-center font-bold text-[#ff5252]">
                  ⏰ {timeLeft}s
                </div>
              </div>
            )}

            {gameState === 'result' && (
              <div className="text-center">
                <h3 className="mb-4 font-display text-3xl font-black text-[#3498db]">KẾT THÚC!</h3>
                <p className="mb-2 text-lg">Người chơi: <b className="text-xl">{playerInfo.name}</b></p>
                <p className="mb-4 text-lg">Điểm: <b className="text-2xl text-[#2ecc71]">{score}/10</b></p>
                <p className="mb-8 font-bold text-slate-500">{saveStatus}</p>
                
                <button
                  onClick={() => setGameState('form')}
                  className="rounded-2xl bg-[#ffcc00] px-8 py-4 font-display text-xl font-bold text-[#856404] shadow-[0_6px_0_#d4ac0d] transition-transform active:translate-y-1 active:shadow-none"
                >
                  🔄 Chơi lại ván mới
                </button>
              </div>
            )}
          </div>

          {/* Leaderboard Panel */}
          <div className="md:col-span-5 lg:col-span-4 max-h-[600px] overflow-y-auto rounded-[25px] border-4 border-white bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <h3 className="mb-6 text-center font-display text-2xl font-black text-[#3498db]">
              🏆 BẢNG VÀNG
            </h3>
            <div className="space-y-3 min-w-0">
              {leaderboard.length === 0 ? (
                <p className="text-center text-slate-500">Chưa có dữ liệu...</p>
              ) : (
                leaderboard.map((d, i) => {
                  const icon = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️"
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl border-l-4 border-[#3498db] bg-white p-3 shadow-sm min-w-0">
                      <span className="text-2xl flex-shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <b className="block truncate text-slate-800" title={d.name}>{d.name}</b>
                        <p className="truncate text-xs text-slate-500" title={`${d.parish} - ${d.score}đ`}>
                          {d.parish} - <span className="font-bold text-[#2ecc71]">{d.score}đ</span>
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GameForm({ onStart }: { onStart: (info: Partial<LeaderboardEntry>) => void }) {
  const [name, setName] = useState('')
  const [diocese, setDiocese] = useState('')
  const [parish, setParish] = useState('')
  const [level, setLevel] = useState('')

  const handleStart = () => {
    if (!name.trim() || !level) {
      alert("Nhập đủ tên và chọn cấp độ!")
      return
    }
    const cleanName = name.trim().slice(0, 25)
    const cleanParish = parish.trim().slice(0, 30)
    onStart({ name: cleanName, diocese, parish: cleanParish || '-', level })
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={25}
        placeholder="👦 Họ tên của bạn*"
        className="w-full rounded-2xl border-2 border-slate-200 p-4 font-bold outline-none focus:border-[#3498db]"
      />
      
      <select
        value={diocese}
        onChange={e => setDiocese(e.target.value)}
        className="w-full rounded-2xl border-2 border-slate-200 p-4 font-bold outline-none focus:border-[#3498db]"
      >
        <option value="">-- Chọn Giáo phận --</option>
        <optgroup label="Tổng Giáo phận Hà Nội">
          <option value="Hà Nội">Tổng Giáo phận Hà Nội</option>
          <option value="Bắc Ninh">Giáo phận Bắc Ninh</option>
          <option value="Bùi Chu">Giáo phận Bùi Chu</option>
          <option value="Hà Tĩnh">Giáo phận Hà Tĩnh</option>
          <option value="Hải Phòng">Giáo phận Hải Phòng</option>
          <option value="Hưng Hóa">Giáo phận Hưng Hóa</option>
          <option value="Lạng Sơn - Cao Bằng">Giáo phận Lạng Sơn - Cao Bằng</option>
          <option value="Phát Diệm">Giáo phận Phát Diệm</option>
          <option value="Thái Bình">Giáo phận Thái Bình</option>
          <option value="Vinh">Giáo phận Vinh</option>
        </optgroup>
        <optgroup label="Tổng Giáo phận Huế">
          <option value="Huế">Tổng Giáo phận Huế</option>
          <option value="Đà Nẵng">Giáo phận Đà Nẵng</option>
          <option value="Qui Nhơn">Giáo phận Qui Nhơn</option>
          <option value="Kontum">Giáo phận Kontum</option>
          <option value="Nha Trang">Giáo phận Nha Trang</option>
          <option value="Ban Mê Thuột">Giáo phận Ban Mê Thuột</option>
        </optgroup>
        <optgroup label="Tổng Giáo phận Sài Gòn">
          <option value="Sài Gòn">Tổng Giáo phận Sài Gòn</option>
          <option value="Đà Lạt">Giáo phận Đà Lạt</option>
          <option value="Phan Thiết">Giáo phận Phan Thiết</option>
          <option value="Phú Cường">Giáo phận Phú Cường</option>
          <option value="Xuân Lộc">Giáo phận Xuân Lộc</option>
          <option value="Bà Rịa">Giáo phận Bà Rịa</option>
          <option value="Mỹ Tho">Giáo phận Mỹ Tho</option>
          <option value="Vĩnh Long">Giáo phận Vĩnh Long</option>
          <option value="Long Xuyên">Giáo phận Long Xuyên</option>
          <option value="Cần Thơ">Giáo phận Cần Thơ</option>
        </optgroup>
        <option value="Khác">Khác...</option>
      </select>
      
      <input
        value={parish}
        onChange={e => setParish(e.target.value)}
        maxLength={30}
        placeholder="🏠 Giáo xứ"
        className="w-full rounded-2xl border-2 border-slate-200 p-4 font-bold outline-none focus:border-[#3498db]"
      />
      
      <select
        value={level}
        onChange={e => setLevel(e.target.value)}
        className="w-full rounded-2xl border-2 border-slate-200 p-4 font-bold outline-none focus:border-[#3498db]"
      >
        <option value="">-- Chọn cấp độ --</option>
        <option value="khai_tam">🟢 Dễ (Khai Tâm)</option>
        <option value="them_suc">🟡 Vừa (Thêm Sức)</option>
        <option value="song_dao">🔴 Khó (Sống Đạo)</option>
        <option value="tuy_chon">🌟 Tổng hợp (10 câu)</option>
      </select>
      
      <button
        onClick={handleStart}
        className="mt-2 w-full rounded-2xl bg-[#ffcc00] p-4 font-display text-xl font-bold text-[#856404] shadow-[0_6px_0_#d4ac0d] transition-transform active:translate-y-1 active:shadow-none hover:bg-[#ffe066]"
      >
        ▶ Bắt đầu chơi
      </button>
      
      <p className="mt-4 text-center text-xs italic text-slate-400">
        Tác giả: Giuse Phạm Duy Ái, SDS
      </p>
    </div>
  )
}
