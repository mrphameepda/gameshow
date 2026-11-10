import HomeButton from '../../components/HomeButton';
import { useState, useEffect, useRef } from 'react'
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast } from 'firebase/database'
import confetti from 'canvas-confetti'
import { Volume2, VolumeX, Maximize, Minimize, HelpCircle, CheckCircle, RefreshCw, Play, Pause } from 'lucide-react'
import { SAP_XEP_QUESTIONS } from '../../data/questionBank';
import QuestionSelectorModal from '../../components/QuestionSelectorModal';
import { questionService } from '../../services/questionService';
import { useAuth } from '@/contexts/AuthContext'
import GuestSaveScorePopup from '@/components/GuestSaveScorePopup'
import { rtdb } from '@/config/firebase'

const db = getDatabase(rtdb.app)



const clickAudio = new Audio('/sounds/sap-xep/click.wav')
const timerAudio = new Audio('/sounds/sap-xep/timer.mp3')
const correctAudio = new Audio('/sounds/sap-xep/correct.mp3')
const wrongAudio = new Audio('/sounds/sap-xep/wrong.mp3')
clickAudio.volume = 0.5
timerAudio.volume = 0.7

export default function SapXepKinhThanh() {
    const [appState, setAppState] = useState<'setup' | 'playing'>('setup')
    const [setupMode, setSetupMode] = useState<'single' | 'team'>('single')
    
    const [playerName, setPlayerName] = useState('')
    const [playerParish, setPlayerParish] = useState('')
    const [teamCount, setTeamCount] = useState(2)
    const [teamNames, setTeamNames] = useState(['Đội 1', 'Đội 2', 'Đội 3', 'Đội 4', 'Đội 5'])
    
    const [teams, setTeams] = useState<{name: string, score: number}[]>([])
    const [usedIndices, setUsedIndices] = useState({ easy: [] as number[], medium: [] as number[], hard: [] as number[] })
    const [level, setLevel] = useState<'easy'|'medium'|'hard'>('easy')
    const [singleCount, setSingleCount] = useState(1)
    
    const [gameQuestions, setGameQuestions] = useState(SAP_XEP_QUESTIONS)
    const [isSelectorOpen, setIsSelectorOpen] = useState(false)
    
    const [curVerse, setCurVerse] = useState<{q: string, c: string} | null>(null)
    const [poolWords, setPoolWords] = useState<{id: string, w: string}[]>([])
    const [resWords, setResWords] = useState<{id: string, w: string}[]>([])
    
    const [isAnswerShown, setIsAnswerShown] = useState(false)
    const [isWrongFlash, setIsWrongFlash] = useState(false)
    
    const [timeLeft, setTimeLeft] = useState(60)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const timerRef = useRef<number|null>(null)
    
    const [isMuted, setIsMuted] = useState(false)
    const [projectorMode, setProjectorMode] = useState(false)
    const [showHandbook, setShowHandbook] = useState(false)
    const [leaderboard, setLeaderboard] = useState<any[]>([])

    useEffect(() => {
        const scoresRef = query(ref(db, 'leaderboard_verses'), orderByChild('score'), limitToLast(10))
        const unsub = onValue(scoresRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const list = Object.values(data) as any[]
                list.sort((a, b) => b.score - a.score)
                setLeaderboard(list)
            } else {
                setLeaderboard([])
            }
        })
        return () => {
            unsub()
            if (timerRef.current) clearInterval(timerRef.current)
            timerAudio.pause()
            timerAudio.currentTime = 0
            correctAudio.pause()
            correctAudio.currentTime = 0
            wrongAudio.pause()
            wrongAudio.currentTime = 0
        }
    }, [])

    useEffect(() => {
        clickAudio.muted = isMuted
        timerAudio.muted = isMuted
        correctAudio.muted = isMuted
        wrongAudio.muted = isMuted
    }, [isMuted])

    const playClick = () => {
        clickAudio.currentTime = 0
        clickAudio.play().catch(()=>{})
    }

    const { currentUser, saveUserScore: saveUserScoreAuth } = useAuth()
    const [showGuestPopup, setShowGuestPopup] = useState(false)
    const [finalGameScore, setFinalGameScore] = useState(0)

    const saveScore = async (name: string, parish: string, score: number) => {
        if (!name || score <= 0) return
        try {
            await push(ref(db, 'leaderboard_verses'), {
                name: name.trim().slice(0, 25),
                parish: (parish || "Ẩn danh").trim().slice(0, 30),
                score: score,
                timestamp: Date.now()
            })
        } catch (e) {}

        // Save to user profile if logged in, otherwise show guest popup
        setFinalGameScore(score)
        if (currentUser) {
            saveUserScoreAuth('sap-xep-kinh-thanh', 'Sắp Xếp Câu Kinh Thánh', score)
        } else {
            setTimeout(() => setShowGuestPopup(true), 1500)
        }
    }

    const initGame = (mode: 'single' | 'team') => {
        playClick()
        setUsedIndices({ easy: [], medium: [], hard: [] })
        if (mode === 'single') {
            const safeName = playerName.trim().slice(0, 25)
            if (!safeName) return alert("Vui lòng nhập tên!")
            setTeams([{ name: safeName, score: 0 }])
            setSingleCount(1)
            loadQuestion('easy', { easy: [], medium: [], hard: [] })
        } else {
            setTeams(teamNames.slice(0, teamCount).map(n => ({ name: n.trim().slice(0, 25) || "Đội", score: 0 })))
            loadQuestion('easy', { easy: [], medium: [], hard: [] })
        }
        setAppState('playing')
    }

    const loadQuestion = (lv: 'easy'|'medium'|'hard', currentUsed = usedIndices) => {
        setLevel(lv)
        const pool = gameQuestions[lv] || []
        if (pool.length === 0) return;
        let available = pool.map((_, i) => i).filter(idx => !currentUsed[lv].includes(idx))
        if (available.length === 0) {
            currentUsed[lv] = []
            available = pool.map((_, i) => i)
        }
        const rIdx = available[Math.floor(Math.random() * available.length)]
        currentUsed[lv].push(rIdx)
        setUsedIndices(currentUsed)
        
        const verse = pool[rIdx]
        setCurVerse(verse)
        
        const cleanVerse = verse.q.replace(/[.,]/g, '').trim()
        const words = cleanVerse.split(' ')
        const shuffled = [...words].sort(() => Math.random() - 0.5)
        
        setPoolWords(shuffled.map((w, i) => ({ id: `${i}-${w}-${Math.random()}`, w })))
        setResWords([])
        setIsAnswerShown(false)
        setIsWrongFlash(false)
        resetTimer()
        
        if (setupMode === 'single') {
            startTimer()
        }
    }

    const changeQuestionLogic = () => {
        playClick()
        if (setupMode === 'single') {
            let nextLv = level
            if (singleCount < 5) nextLv = 'easy'
            else if (singleCount < 10) nextLv = 'medium'
            else nextLv = 'hard'
            loadQuestion(nextLv)
        } else {
            loadQuestion(level)
        }
    }

    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current)
        setIsTimerRunning(false)
        setTimeLeft(60)
        timerAudio.pause()
        timerAudio.currentTime = 0
    }

    const startTimer = () => {
        playClick()
        if (isTimerRunning) return
        setIsTimerRunning(true)
        timerAudio.loop = true
        timerAudio.currentTime = 0
        timerAudio.play().catch(()=>{})
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current)
                    setIsTimerRunning(false)
                    timerAudio.pause()
                    handleTimeOut()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const pauseTimer = () => {
        playClick()
        if (timerRef.current) clearInterval(timerRef.current)
        setIsTimerRunning(false)
        timerAudio.pause()
    }

    const handleTimeOut = () => {
        if (setupMode === 'single') {
            wrongAudio.currentTime = 0; wrongAudio.play().catch(()=>{})
            alert(`Hết giờ! Game kết thúc.\nĐiểm của bạn: ${teams[0].score}`)
            saveScore(teams[0].name, playerParish, teams[0].score).then(() => window.location.reload())
        }
    }

    const wordToResult = (item: {id: string, w: string}) => {
        playClick()
        setPoolWords(prev => prev.filter(p => p.id !== item.id))
        setResWords(prev => [...prev, item])
    }

    const wordToPool = (item: {id: string, w: string}) => {
        playClick()
        setResWords(prev => prev.filter(p => p.id !== item.id))
        setPoolWords(prev => [...prev, item])
    }

    const checkSingleAnswer = () => {
        playClick()
        const userStr = resWords.map(r => r.w).join(' ')
        const correctStr = curVerse?.q.replace(/[.,]/g, '').trim()
        
        if (userStr === correctStr) {
            correctAudio.currentTime = 0; correctAudio.play().catch(()=>{})
            resetTimer()
            setTeams(prev => {
                const arr = [...prev]
                arr[0].score += 10
                return arr
            })
            if (singleCount >= 15) {
                confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } })
                alert("🎉 CHIẾN THẮNG! Bạn đã hoàn thành xuất sắc 15 câu.")
                saveScore(teams[0].name, playerParish, teams[0].score + 10).then(() => window.location.reload())
            } else {
                setSingleCount(prev => prev + 1)
                setIsAnswerShown(true)
                setTimeout(() => {
                    let nextLv: 'easy'|'medium'|'hard' = 'easy'
                    if (singleCount + 1 <= 5) nextLv = 'easy'
                    else if (singleCount + 1 <= 10) nextLv = 'medium'
                    else nextLv = 'hard'
                    loadQuestion(nextLv)
                }, 1500)
            }
        } else {
            wrongAudio.currentTime = 0; wrongAudio.play().catch(()=>{})
            resetTimer()
            alert(`SAI RỒI! Game kết thúc.\nĐiểm của bạn: ${teams[0].score}`)
            saveScore(teams[0].name, playerParish, teams[0].score).then(() => window.location.reload())
        }
    }

    const showAnswer = () => {
        playClick()
        const userStr = resWords.map(r => r.w).join(' ')
        const correctStr = curVerse?.q.replace(/[.,]/g, '').trim()
        
        if (userStr === correctStr) {
            correctAudio.currentTime = 0; correctAudio.play().catch(()=>{})
            setIsAnswerShown(true)
            resetTimer()
        } else {
            wrongAudio.currentTime = 0; wrongAudio.play().catch(()=>{})
            setIsWrongFlash(true)
            setTimeout(() => setIsWrongFlash(false), 800)
        }
    }
    
    const modifyScore = (idx: number, pts: number) => {
        playClick()
        setTeams(prev => {
            const arr = [...prev]
            arr[idx].score = Math.max(0, arr[idx].score + pts)
            return arr
        })
        if (pts > 0) confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } })
    }

    const toggleFullscreen = () => {
        playClick()
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => console.error(e))
            setProjectorMode(true)
        } else {
            document.exitFullscreen()
            setProjectorMode(false)
        }
    }

    return (
        <div className="min-h-screen font-display bg-gradient-to-br from-slate-950 via-[#0b1329] to-indigo-950 text-slate-100 flex flex-col overflow-hidden relative">
            {showGuestPopup && (
                <GuestSaveScorePopup
                    score={finalGameScore}
                    gameId="sap-xep-kinh-thanh"
                    gameName="Sắp Xếp Câu Kinh Thánh"
                    onClose={() => setShowGuestPopup(false)}
                />
            )}
            {/* HEADER */}
            <header className="p-3 sm:p-4 flex items-center justify-between z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
                <HomeButton confirmExit={appState === 'playing'} />

                {appState === 'playing' && (
                    <div className="flex-1 flex justify-center items-center gap-2 sm:gap-4">
                        {setupMode === 'team' && (
                            <div className="flex bg-slate-900/80 p-1 rounded-full border border-white/10 shadow-inner">
                                <button onClick={() => {playClick(); loadQuestion('easy')}} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all ${level==='easy'?'bg-emerald-500 text-slate-950 shadow-md':'text-slate-400 hover:text-white'}`}>DỄ</button>
                                <button onClick={() => {playClick(); loadQuestion('medium')}} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all ${level==='medium'?'bg-orange-500 text-slate-950 shadow-md':'text-slate-400 hover:text-white'}`}>VỪA</button>
                                <button onClick={() => {playClick(); loadQuestion('hard')}} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all ${level==='hard'?'bg-rose-500 text-white shadow-md':'text-slate-400 hover:text-white'}`}>KHÓ</button>
                            </div>
                        )}
                        {setupMode === 'single' && (
                            <div className="bg-amber-500/20 border border-amber-500/50 text-amber-400 px-4 py-1.5 rounded-full font-black text-sm tracking-widest shadow-inner">
                                CÂU: {singleCount}/15
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 flex items-center justify-center font-black text-lg sm:text-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] ${timeLeft <= 10 ? 'border-rose-500 text-rose-500 animate-pulse bg-rose-500/10' : 'border-amber-400 text-amber-400 bg-black/40'}`}>
                                {timeLeft}
                            </div>
                            {!isTimerRunning ? (
                                <button onClick={startTimer} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-full shadow-lg"><Play size={16} /></button>
                            ) : (
                                <button onClick={pauseTimer} className="bg-rose-600 hover:bg-rose-500 text-white p-2 rounded-full shadow-lg"><Pause size={16} /></button>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <button onClick={() => setIsMuted(!isMuted)} className="p-2 sm:px-4 sm:py-2 rounded-full bg-slate-800/80 border border-white/10 hover:bg-slate-700 transition-all font-bold text-sm flex items-center gap-2">
                        {isMuted ? <VolumeX size={18} className="text-rose-400"/> : <Volume2 size={18} className="text-emerald-400"/>}
                        <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound'}</span>
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 sm:px-4 sm:py-2 rounded-full bg-slate-800/80 border border-white/10 hover:bg-slate-700 transition-all text-amber-400">
                        {projectorMode ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* MAIN CONTENT */}
                <main className="flex-[3] flex flex-col p-4 sm:p-6 overflow-y-auto">
                    {appState === 'setup' && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up max-w-2xl mx-auto w-full">
                            <h1 className="font-black text-4xl sm:text-5xl md:text-6xl text-center uppercase mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 drop-shadow-xl">
                                Sắp Xếp<br/>Câu Kinh Thánh
                            </h1>
                            
                            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl w-full shadow-2xl">
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <button onClick={() => { playClick(); setIsSelectorOpen(true); }} className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl shadow-lg border-b-4 border-teal-800 transition-all uppercase">📚 Bộ Câu Hỏi</button>
                                    <button onClick={() => {playClick(); setSetupMode('single')}} className={`flex-1 py-3 rounded-xl font-black text-lg transition-all ${setupMode==='single'?'bg-blue-600 text-white shadow-lg border-b-4 border-blue-800':'bg-slate-800 text-slate-400 border-b-4 border-slate-900'}`}>CHƠI ĐƠN</button>
                                    <button onClick={() => {playClick(); setSetupMode('team')}} className={`flex-1 py-3 rounded-xl font-black text-lg transition-all ${setupMode==='team'?'bg-blue-600 text-white shadow-lg border-b-4 border-blue-800':'bg-slate-800 text-slate-400 border-b-4 border-slate-900'}`}>CHƠI ĐỘI</button>
                                </div>

                                {setupMode === 'single' ? (
                                    <div className="space-y-4 animate-fade-in">
                                        <input type="text" placeholder="👦 Họ và tên..." maxLength={25} value={playerName} onChange={e=>setPlayerName(e.target.value)} className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold outline-none focus:border-amber-500 text-center text-lg"/>
                                        <input type="text" placeholder="⛪ Giáo xứ (Tùy chọn)..." maxLength={30} value={playerParish} onChange={e=>setPlayerParish(e.target.value)} className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold outline-none focus:border-amber-500 text-center text-lg"/>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="flex items-center justify-between text-white font-bold">
                                            <span>Số lượng đội (2-5):</span>
                                            <input type="range" min={2} max={5} value={teamCount} onChange={e=>setTeamCount(parseInt(e.target.value))} className="w-1/2 accent-amber-500" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {Array.from({length: teamCount}).map((_, i) => (
                                                <input key={i} type="text" placeholder={`Tên Đội ${i+1}`} maxLength={25} value={teamNames[i]} onChange={e=>{
                                                    const arr = [...teamNames]
                                                    arr[i] = e.target.value
                                                    setTeamNames(arr)
                                                }} className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold outline-none focus:border-amber-500 text-center"/>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button onClick={() => initGame(setupMode)} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-[0_8px_30px_rgba(245,158,11,0.3)] text-xl mt-6 transition-transform hover:scale-105 uppercase">
                                    BẮT ĐẦU
                                </button>
                                
                                <div className="flex justify-between items-center mt-6">
                                    <button onClick={() => {playClick(); setShowHandbook(true)}} className="flex items-center gap-1 text-amber-400 font-bold hover:text-amber-300 text-sm">
                                        <HelpCircle size={16}/> Hướng dẫn
                                    </button>
                                    <p className="text-slate-500 font-bold italic text-xs">Tác giả: Giuse Phạm Duy Ái, SDS</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {appState === 'playing' && (
                        <div className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto">
                            
                            {/* SCORES (Mobile top, Desktop above board) */}
                            <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6 shadow-lg flex flex-row overflow-x-auto gap-3 scrollbar-hide snap-x">
                                {teams.map((t, i) => (
                                    <div key={i} className="snap-center shrink-0 min-w-[120px] flex-1 flex flex-col items-center bg-slate-800/80 border border-slate-600 rounded-xl p-3">
                                        <div className="font-bold text-slate-300 truncate w-full text-center text-sm mb-1">{t.name}</div>
                                        <div className="font-black text-2xl text-amber-400 mb-2">{t.score}</div>
                                        {setupMode === 'team' && (
                                            <div className="flex gap-2 w-full">
                                                <button onClick={()=>modifyScore(i, 10)} className="flex-1 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded text-sm py-1 font-black">+</button>
                                                <button onClick={()=>modifyScore(i, -10)} className="flex-1 bg-rose-600/80 hover:bg-rose-500 text-white rounded text-sm py-1 font-black">-</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* PROJECTOR SCREEN (RESULT AREA) */}
                            <div className={`w-full bg-slate-100 border-4 sm:border-8 border-slate-800 border-b-[16px] sm:border-b-[24px] rounded-2xl min-h-[160px] sm:min-h-[200px] mb-6 p-4 sm:p-6 flex flex-col items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.1),_0_20px_40px_rgba(0,0,0,0.5)] transition-colors ${isWrongFlash ? 'bg-rose-200' : ''}`}>
                                
                                {isAnswerShown ? (
                                    <div className="text-center animate-fade-in">
                                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-800 mb-4 drop-shadow-md leading-tight">{curVerse?.q}</h2>
                                        <p className="text-lg sm:text-2xl font-bold text-rose-600 italic">{curVerse?.c}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full min-h-[50px] content-start">
                                        {resWords.map((item) => (
                                            <div key={item.id} onClick={()=>wordToPool(item)} className="bg-white border-2 border-slate-300 hover:border-rose-400 hover:bg-rose-50 px-4 sm:px-5 py-2 sm:py-3 rounded-xl cursor-pointer font-black text-slate-800 text-lg sm:text-xl shadow-[0_4px_0_#94a3b8] active:translate-y-[4px] active:shadow-none transition-all select-none">
                                                {item.w}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* WORD POOL */}
                            {!isAnswerShown && (
                                <div className="w-full bg-slate-900/40 border border-white/5 rounded-3xl p-4 sm:p-6 mb-6 min-h-[120px] flex flex-wrap justify-center gap-2 sm:gap-3">
                                    {poolWords.map((item) => (
                                        <div key={item.id} onClick={()=>wordToResult(item)} className="bg-white border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 px-4 sm:px-5 py-2 sm:py-3 rounded-xl cursor-pointer font-black text-slate-800 text-lg sm:text-xl shadow-[0_4px_0_#94a3b8] active:translate-y-[4px] active:shadow-none transition-all select-none animate-fade-in-up">
                                            {item.w}
                                        </div>
                                    ))}
                                    {poolWords.length === 0 && resWords.length === 0 && <div className="text-slate-500 font-bold">Đang tải...</div>}
                                </div>
                            )}

                            {/* HOST CONTROLS */}
                            <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
                                {setupMode === 'single' ? (
                                    <button onClick={checkSingleAnswer} disabled={isAnswerShown} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-black text-xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-transform hover:scale-105 disabled:opacity-50 flex items-center gap-2">
                                        <CheckCircle /> CHỐT ĐÁP ÁN
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={changeQuestionLogic} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105">
                                            <RefreshCw size={20}/> ĐỔI CÂU
                                        </button>
                                        <button onClick={showAnswer} disabled={isAnswerShown} className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-50">
                                            <CheckCircle size={20}/> ĐÁP ÁN
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* RIGHT SIDEBAR (LEADERBOARD) - Hidden on Mobile */}
                <aside className="hidden lg:flex flex-[1] max-w-sm flex-col bg-slate-900/80 backdrop-blur-xl border-l border-white/10 p-4 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20">
                    <h2 className="text-amber-400 font-black text-xl mb-4 text-center pb-3 border-b border-white/10 uppercase flex items-center justify-center gap-2">
                        🏆 BẢNG VÀNG
                    </h2>
                    <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 space-y-2">
                        {leaderboard.length === 0 ? (
                            <p className="text-slate-500 text-center italic text-sm mt-4">Chưa có dữ liệu...</p>
                        ) : (
                            leaderboard.map((item, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                    <span className="font-black text-amber-500 text-lg w-6 text-center">#{idx+1}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-200 text-sm truncate">{item.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase truncate">{item.parish}</div>
                                    </div>
                                    <div className="text-emerald-400 font-black text-xl">{item.score}</div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>

            {/* HANDBOOK MODAL */}
            {showHandbook && (
                <div className="absolute inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl w-full max-w-md shadow-2xl animate-fade-in-up">
                        <div className="p-6 sm:p-8 text-slate-300">
                            <h2 className="text-center text-amber-400 font-black text-2xl mb-4 uppercase">Luật Chơi</h2>
                            <p className="text-sm sm:text-base leading-relaxed mb-6 italic border-l-4 border-amber-500 pl-4 bg-slate-800/50 p-4 rounded-r-xl">
                                Ở chế độ chơi đơn, máy sẽ tăng độ khó tự động (1-5 Dễ, 6-10 Vừa, 11-15 Khó). Nếu đoán đúng +10 điểm, đoán sai hoặc hết 60s sẽ kết thúc trò chơi. Điểm sẽ được lưu lên Bảng Vàng.<br/><br/>
                                Khi chơi đội, quản trò có quyền chọn câu hỏi theo mức độ mong muốn, tự cộng/trừ điểm và điều khiển trận đấu.
                            </p>
                            <button onClick={() => {playClick(); setShowHandbook(false)}} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl shadow-lg uppercase transition-transform hover:scale-105">
                                Đã hiểu
                            </button>
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
                        const formatted = questionService.getQuestionsForGame('sap-xep-kinh-thanh', qs);
                        setGameQuestions(formatted);
                    }}
                />
            )}
        </div>
    )
}
