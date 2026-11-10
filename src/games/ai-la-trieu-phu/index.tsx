import HomeButton from '../../components/HomeButton';
import { useState, useEffect, useRef } from 'react'
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast } from 'firebase/database'
import confetti from 'canvas-confetti'
import { Volume2, VolumeX, Maximize, Minimize, PhoneCall, Users, RefreshCw, XSquare } from 'lucide-react'
import { ALTP_QUESTIONS } from '../../data/questionBank';
import { useAuth } from '@/contexts/AuthContext'
import GuestSaveScorePopup from '@/components/GuestSaveScorePopup'
import { rtdb } from '@/config/firebase'

const db = getDatabase(rtdb.app)



// AUDIO
const introAudio = new Audio('/sounds/trieu-phu/intro.mp3')
const suspenseAudio = new Audio('/sounds/trieu-phu/suspense.mp3')
const correctAudio = new Audio('/sounds/trieu-phu/correct.mp3')
const wrongAudio = new Audio('/sounds/trieu-phu/wrong.mp3')
const tickAudio = new Audio('/sounds/trieu-phu/tick.mp3')

const playAudio = (a: HTMLAudioElement, loop = false) => {
    a.currentTime = 0
    a.loop = loop
    a.play().catch(()=>{})
}
const stopAudio = (a: HTMLAudioElement) => {
    a.pause()
    a.currentTime = 0
}

const MONEY_ARR = ["200.000","400.000","600.000","1.000.000","2.000.000","3.000.000","6.000.000","10.000.000","14.000.000","22.000.000","30.000.000","40.000.000","60.000.000","85.000.000","150.000.000"]
const IMPORTANT_LEVELS = [4, 9, 10, 11, 12, 13, 14] // 0-indexed

export const calculateMillionaireRankingScore = (
  currentQuestionIndex: number, // 0 to 15
  remainingLifelinesCount: number = 0,
  timeLeftBonus: number = 0
): number => {
  const questionScores = [
    0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 850, 1000, 1150, 1300, 1450, 1600,
  ];
  const baseScore = questionScores[Math.min(currentQuestionIndex, 15)] || 0;
  const lifelineBonus = remainingLifelinesCount * 40;
  const totalRankingScore = baseScore + lifelineBonus + Math.min(timeLeftBonus, 60);
  return Math.round(totalRankingScore);
};


export default function AiLaTrieuPhuGame() {
    const [appState, setAppState] = useState<'login' | 'playing'>('login')
    const [player, setPlayer] = useState({ name: '', diocese: '', parish: '' })
    
    // Game progress
    const [curIdx, setCurIdx] = useState(0) // 0 to 14
    const [curQ, setCurQ] = useState<{q: string, a: string[], c: number} | null>(null)
    const [usedQuestions, setUsedQuestions] = useState({ easy: [] as number[], medium: [] as number[], hard: [] as number[] })
    const [options, setOptions] = useState<{text: string, originalIndex: number, removed: boolean}[]>([])
    
    // Interaction
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
    const [status, setStatus] = useState<'idle' | 'confirming' | 'suspense' | 'revealing' | 'next_area'>('idle')
    const [correctIdx, setCorrectIdx] = useState<number | null>(null)
    
    // Lifelines
    const [lifelines, setLifelines] = useState({
        fiftyFifty: false,
        call: false,
        audience: false,
        swap: false
    })
    
    // Timer
    const [timeLeft, setTimeLeft] = useState(30)
    const timerRef = useRef<number | null>(null)
    
    // Modals
    const [showConfirm, setShowConfirm] = useState(false)
    const [showLifeline, setShowLifeline] = useState<{show: boolean, type: string, title: string, content: string}>({show: false, type: '', title: '', content: ''})
    const [showResultModal, setShowResultModal] = useState(false)
    const [finalMessage, setFinalMessage] = useState('')
    const [finalPrize, setFinalPrize] = useState('')
    const [finalRankingScore, setFinalRankingScore] = useState(0)
    
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [isMuted, setIsMuted] = useState(false)
    const [projectorMode, setProjectorMode] = useState(false)

    useEffect(() => {
        const topScoresQuery = query(ref(db, 'leaderboard'), orderByChild('score'), limitToLast(10))
        const unsub = onValue(topScoresQuery, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const list = Object.values(data) as any[]
                list.sort((a, b) => b.score - a.score)
                setLeaderboard(list)
            } else {
                setLeaderboard([])
            }
        })
        introAudio.loop = true
        introAudio.play().catch(()=>{})
        return () => {
            unsub()
            if (timerRef.current) clearInterval(timerRef.current)
            introAudio.pause(); introAudio.currentTime = 0;
            suspenseAudio.pause(); suspenseAudio.currentTime = 0;
            correctAudio.pause(); correctAudio.currentTime = 0;
            wrongAudio.pause(); wrongAudio.currentTime = 0;
            tickAudio.pause(); tickAudio.currentTime = 0;
        }
    }, [])

    useEffect(() => {
        introAudio.muted = isMuted
        suspenseAudio.muted = isMuted
        correctAudio.muted = isMuted
        wrongAudio.muted = isMuted
        tickAudio.muted = isMuted
    }, [isMuted])

    const { currentUser, saveUserScore: saveUserScoreAuth } = useAuth()
    const [showGuestPopup, setShowGuestPopup] = useState(false)
    const [finalGameScore, setFinalGameScore] = useState(0)

    const saveScore = async (prizeStr: string, passedQ: number) => {
        const remainingLifelines = [lifelines.fiftyFifty, lifelines.call, lifelines.audience, lifelines.swap].filter(v => !v).length;
        const rankingScore = calculateMillionaireRankingScore(passedQ, remainingLifelines, timeLeft);
        
        setFinalPrize(prizeStr);
        setFinalRankingScore(rankingScore);

        if (!player.name) return
        try {
            await push(ref(db, 'leaderboard'), {
                name: player.name.trim().slice(0, 25),
                diocese: player.diocese.trim().slice(0, 30),
                parish: player.parish.trim().slice(0, 30),
                prize: prizeStr,
                score: rankingScore,
                timestamp: Date.now()
            })
        } catch (e) { console.error(e) }

        // Save to user profile if logged in, otherwise show guest popup
        setFinalGameScore(rankingScore)
        if (currentUser) {
            saveUserScoreAuth('ai-la-trieu-phu', 'Ai Là Triệu Phú', rankingScore)
        } else if (rankingScore > 0) {
            setTimeout(() => setShowGuestPopup(true), 2500)
        }
    }

    const startGame = () => {
        if (!player.name.trim()) return alert("Bạn nhập Họ tên nhé!")
        stopAudio(introAudio)
        setAppState('playing')
        loadQuestion(0, { easy: [], medium: [], hard: [] })
    }

    const loadQuestion = (qIdx: number, currentUsed = usedQuestions) => {
        setCurIdx(qIdx)
        setSelectedIdx(null)
        setCorrectIdx(null)
        setStatus('idle')
        setShowConfirm(false)
        setShowResultModal(false)
        
        let type: 'easy'|'medium'|'hard' = qIdx < 5 ? 'easy' : (qIdx < 10 ? 'medium' : 'hard')
        let pool = ALTP_QUESTIONS[type]
        let available = pool.map((_, i) => i).filter(i => !currentUsed[type].includes(i))
        if (available.length === 0) {
            currentUsed[type] = []
            available = pool.map((_, i) => i)
        }
        
        let pick = available[Math.floor(Math.random() * available.length)]
        currentUsed[type].push(pick)
        setUsedQuestions(currentUsed)
        
        let q = pool[pick]
        setCurQ(q)
        
        // Shuffle options
        let opts = q.a.map((text, idx) => ({text, originalIndex: idx, removed: false}))
        opts.sort(() => Math.random() - 0.5)
        setOptions(opts)
        
        startTimer()
    }

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current)
        setTimeLeft(30)
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev === 6 && !isMuted) {
                    playAudio(tickAudio)
                }
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current)
                    handleTimeout()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current)
    }

    const handleTimeout = () => {
        stopAudio(tickAudio)
        playAudio(wrongAudio)
        setStatus('revealing')
        const corrOptIdx = options.findIndex(o => o.originalIndex === curQ?.c)
        setCorrectIdx(corrOptIdx)
        endGame(false)
    }

    const handleAnswerClick = (idx: number) => {
        if (status !== 'idle' || options[idx].removed) return
        setSelectedIdx(idx)
        
        if (IMPORTANT_LEVELS.includes(curIdx)) {
            setStatus('confirming')
            setShowConfirm(true)
        } else {
            processAnswer(idx)
        }
    }

    const confirmFinal = (confirm: boolean) => {
        setShowConfirm(false)
        if (confirm) {
            if (selectedIdx !== null) processAnswer(selectedIdx)
        } else {
            setSelectedIdx(null)
            setStatus('idle')
        }
    }

    const processAnswer = (idx: number) => {
        stopTimer()
        stopAudio(tickAudio)
        setStatus('suspense')
        playAudio(suspenseAudio)
        
        setTimeout(() => {
            setStatus('revealing')
            stopAudio(suspenseAudio)
            const corrOptIdx = options.findIndex(o => o.originalIndex === curQ?.c)
            setCorrectIdx(corrOptIdx)
            
            if (options[idx].originalIndex === curQ?.c) {
                playAudio(correctAudio)
                if (curIdx === 14) {
                    endGame(true)
                } else {
                    setStatus('next_area')
                }
            } else {
                playAudio(wrongAudio)
                endGame(false)
            }
        }, 3000)
    }

    const nextQ = () => {
        loadQuestion(curIdx + 1)
    }

    const endGame = (win: boolean) => {
        let prize = "0"
        let passedQ = 0
        if (win) {
            prize = MONEY_ARR[14]
            passedQ = 15
            confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } })
            setFinalMessage("CHÚC MỪNG BẠN ĐÃ TRỞ THÀNH TRIỆU PHÚ CÔNG GIÁO!")
        } else {
            // Find milestone
            if (curIdx >= 10) { prize = MONEY_ARR[9]; passedQ = 10; }
            else if (curIdx >= 5) { prize = MONEY_ARR[4]; passedQ = 5; }
            else { prize = "0"; passedQ = 0; }
            setFinalMessage("Rất tiếc! Bạn phải dừng cuộc chơi.")
        }
        saveScore(prize, passedQ)
        setTimeout(() => {
            setShowResultModal(true)
        }, 2000)
    }

    const quitGame = () => {
        const confirmQuit = window.confirm("Bạn muốn dừng cuộc chơi và bảo toàn số tiền thưởng hiện tại?")
        if (confirmQuit) {
            stopTimer()
            stopAudio(tickAudio)
            const prize = curIdx > 0 ? MONEY_ARR[curIdx - 1] : "0"
            setFinalMessage("Bạn đã dừng cuộc chơi.")
            saveScore(prize, curIdx)
            setShowResultModal(true)
        }
    }

    const handleLifeline = (type: 'fiftyFifty' | 'call' | 'audience' | 'swap') => {
        if (status !== 'idle' || lifelines[type]) return
        
        setLifelines(prev => ({...prev, [type]: true}))
        
        if (type === 'fiftyFifty') {
            const corrOptIdx = options.findIndex(o => o.originalIndex === curQ?.c)
            let wrongIndices = options.map((_, i) => i).filter(i => i !== corrOptIdx && !options[i].removed)
            // Pick 2 wrong indices to remove
            wrongIndices.sort(() => Math.random() - 0.5)
            const toRemove = wrongIndices.slice(0, 2)
            
            setOptions(prev => prev.map((o, i) => toRemove.includes(i) ? {...o, removed: true} : o))
        } else if (type === 'call') {
            const corrOptIdx = options.findIndex(o => o.originalIndex === curQ?.c)
            const ansChar = ['A', 'B', 'C', 'D'][corrOptIdx]
            setShowLifeline({
                show: true, type: 'call', title: 'GỌI ĐIỆN THOẠI CHO NGƯỜI THÂN',
                content: `Alo, theo tôi thì phương án đúng chắc chắn là ${ansChar}. Bạn hãy chọn ${ansChar} nhé!`
            })
        } else if (type === 'audience') {
            const corrOptIdx = options.findIndex(o => o.originalIndex === curQ?.c)
            let stats = [10, 10, 10, 10]
            stats[corrOptIdx] = 70
            // randomize remaining a bit
            stats = stats.map(v => v === 70 ? v + Math.floor(Math.random()*15) : v - Math.floor(Math.random()*5))
            
            const content = `Khán giả bình chọn:\n A: ${stats[0]}%\n B: ${stats[1]}%\n C: ${stats[2]}%\n D: ${stats[3]}%`
            setShowLifeline({
                show: true, type: 'audience', title: 'HỎI Ý KIẾN KHÁN GIẢ',
                content: content
            })
        } else if (type === 'swap') {
            loadQuestion(curIdx)
        }
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => console.error(e))
            setProjectorMode(true)
        } else {
            document.exitFullscreen()
            setProjectorMode(false)
        }
    }

    return (
        <div className="min-h-screen font-display bg-[#020617] text-slate-100 flex flex-col overflow-hidden relative">
            <div className="absolute top-4 left-4 z-50">
                <HomeButton confirmExit={appState === 'playing'} />
            </div>

            {showGuestPopup && (
                <GuestSaveScorePopup
                    score={finalGameScore}
                    gameId="ai-la-trieu-phu"
                    gameName="Ai Là Triệu Phú"
                    onClose={() => setShowGuestPopup(false)}
                />
            )}

            {/* LOGIN SCREEN */}
            {appState === 'login' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 bg-cover bg-center" style={{backgroundImage: "linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url('/images/games/ai-la-trieu-phu.webp')"}}>
                    <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-6 items-center justify-center animate-fade-in-up">
                        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-6 uppercase text-center tracking-widest drop-shadow-md">AI LÀ TRIỆU PHÚ</h1>
                            <div className="space-y-4">
                                <input type="text" maxLength={25} value={player.name} onChange={e=>setPlayer(prev=>({...prev, name: e.target.value}))} placeholder="👦 Họ và Tên *" className="w-full p-4 rounded-xl bg-slate-800/80 border border-white/10 text-white font-bold outline-none focus:border-yellow-400 text-center"/>
                                <input type="text" maxLength={30} value={player.diocese} onChange={e=>setPlayer(prev=>({...prev, diocese: e.target.value}))} placeholder="⛪ Giáo phận (Tùy chọn)" className="w-full p-4 rounded-xl bg-slate-800/80 border border-white/10 text-white font-bold outline-none focus:border-yellow-400 text-center"/>
                                <input type="text" maxLength={30} value={player.parish} onChange={e=>setPlayer(prev=>({...prev, parish: e.target.value}))} placeholder="🏠 Giáo xứ (Tùy chọn)" className="w-full p-4 rounded-xl bg-slate-800/80 border border-white/10 text-white font-bold outline-none focus:border-yellow-400 text-center"/>
                                <button onClick={startGame} className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black py-4 rounded-xl shadow-[0_8px_30px_rgba(234,179,8,0.3)] text-xl uppercase transition-transform hover:scale-105">BẮT ĐẦU CHƠI</button>
                                <div className="text-center text-white/50 text-[10px] uppercase font-bold mt-2">Giuse Phạm Duy Ái, SDS</div>
                            </div>
                        </div>
                        
                        {/* BẢNG VÀNG */}
                        <div className="hidden lg:flex w-80 bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 h-[500px] flex-col shadow-2xl">
                            <h3 className="text-yellow-400 font-black text-center mb-4 uppercase border-b border-white/10 pb-3 flex items-center justify-center gap-2">🏆 BẢNG VÀNG</h3>
                            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar text-white text-xs">
                                {leaderboard.length === 0 ? (
                                    <div className="text-center text-slate-500 italic mt-4">Đang tải...</div>
                                ) : (
                                    leaderboard.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className={`font-black text-lg ${idx < 3 ? 'text-yellow-500' : 'text-slate-400'}`}>{idx + 1}</span>
                                            <div className="flex-1 truncate">
                                                <div className="font-bold text-sm">{item.name}</div>
                                                <div className="text-[10px] text-slate-400 uppercase truncate">{item.parish || 'Ẩn danh'}</div>
                                            </div>
                                            <div className="text-emerald-400 font-black text-sm">{item.prize}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PLAYING SCREEN */}
            {appState === 'playing' && (
                <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto my-2 sm:my-4 bg-slate-900/80 border-2 sm:border-4 border-slate-700 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl">
                    <header className="p-2 md:p-4 flex justify-between items-center border-b border-white/10 bg-slate-900/90 shrink-0">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button onClick={() => setIsMuted(!isMuted)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-yellow-400 hover:bg-slate-700">
                                {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} />}
                            </button>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button onClick={() => handleLifeline('fiftyFifty')} disabled={lifelines.fiftyFifty} className={`w-10 h-8 md:w-14 md:h-10 rounded-full font-black text-[10px] sm:text-xs border transition-all ${lifelines.fiftyFifty ? 'bg-slate-800 border-slate-700 text-slate-600' : 'bg-blue-900/50 border-blue-400/50 text-blue-400 hover:bg-blue-800'}`}>50:50</button>
                            <button onClick={() => handleLifeline('call')} disabled={lifelines.call} className={`w-10 h-8 md:w-14 md:h-10 rounded-full font-black text-[10px] sm:text-xs border transition-all flex justify-center items-center ${lifelines.call ? 'bg-slate-800 border-slate-700 text-slate-600' : 'bg-blue-900/50 border-blue-400/50 text-blue-400 hover:bg-blue-800'}`}><PhoneCall size={14}/></button>
                            <button onClick={() => handleLifeline('audience')} disabled={lifelines.audience} className={`w-10 h-8 md:w-14 md:h-10 rounded-full font-black text-[10px] sm:text-xs border transition-all flex justify-center items-center ${lifelines.audience ? 'bg-slate-800 border-slate-700 text-slate-600' : 'bg-blue-900/50 border-blue-400/50 text-blue-400 hover:bg-blue-800'}`}><Users size={14}/></button>
                            <button onClick={() => handleLifeline('swap')} disabled={lifelines.swap} className={`w-10 h-8 md:w-14 md:h-10 rounded-full font-black text-[10px] sm:text-xs border transition-all flex justify-center items-center ${lifelines.swap ? 'bg-slate-800 border-slate-700 text-slate-600' : 'bg-blue-900/50 border-blue-400/50 text-blue-400 hover:bg-blue-800'}`}><RefreshCw size={14}/></button>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="bg-black/60 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-yellow-500/50 text-lg sm:text-xl font-black text-yellow-400 font-mono shadow-inner min-w-[3rem] text-center">{timeLeft}</div>
                            <button onClick={quitGame} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-black text-[10px] sm:text-xs uppercase shadow-md flex items-center gap-1">
                                <XSquare size={14} /> <span className="hidden sm:inline">DỪNG</span>
                            </button>
                            <button onClick={toggleFullscreen} className="hidden lg:flex w-10 h-10 rounded-full bg-slate-800 border border-white/10 items-center justify-center text-yellow-400 hover:bg-slate-700">
                                {projectorMode ? <Minimize size={16}/> : <Maximize size={16}/>}
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Main Question Area */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col justify-center">
                            <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6 flex flex-col">
                                <div className="bg-blue-900/30 backdrop-blur-xl border-2 border-blue-500/30 p-6 sm:p-8 text-center rounded-[2rem] shadow-[0_0_30px_rgba(59,130,246,0.15)] relative min-h-[120px] flex items-center justify-center mt-6">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-blue-950 px-6 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg border-2 border-[#0f172a]">Câu {curIdx + 1}</div>
                                    <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed">{curQ?.q}</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-8">
                                    {options.map((opt, idx) => {
                                        let btnClass = "bg-slate-800/80 border-slate-600 text-slate-100 hover:bg-blue-900/60 hover:border-blue-400"
                                        if (opt.removed) {
                                            btnClass = "bg-transparent border-transparent text-transparent pointer-events-none"
                                        } else if (selectedIdx === idx && status === 'suspense') {
                                            btnClass = "bg-yellow-500 border-yellow-400 text-slate-950"
                                        } else if (status === 'revealing') {
                                            if (correctIdx === idx) btnClass = "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse"
                                            else if (selectedIdx === idx) btnClass = "bg-rose-600 border-rose-400 text-white"
                                            else btnClass = "bg-slate-800/50 border-slate-700 text-slate-500"
                                        }
                                        
                                        return (
                                            <button 
                                                key={idx}
                                                onClick={() => handleAnswerClick(idx)}
                                                disabled={status !== 'idle' || opt.removed}
                                                className={`w-full p-4 sm:p-5 text-left flex items-center gap-4 font-bold text-sm sm:text-base border-2 transition-all duration-300 shadow-lg select-none ${btnClass}`}
                                                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' }}
                                            >
                                                <span className={`${opt.removed ? 'text-transparent' : (selectedIdx === idx && status === 'suspense' ? 'text-slate-950' : 'text-yellow-500')} font-black text-lg sm:text-xl min-w-[24px]`}>
                                                    {['A:', 'B:', 'C:', 'D:'][idx]}
                                                </span>
                                                <span className="flex-1">{opt.text}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                                
                                {status === 'next_area' && (
                                    <div className="text-center mt-6 animate-fade-in-up">
                                        <button onClick={nextQ} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-3 rounded-full font-black text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform hover:scale-105">TIẾP THEO ➜</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Money Ladder */}
                        <div className="hidden lg:flex w-72 bg-slate-950/50 border-l border-white/5 p-6 flex-col justify-end shrink-0 shadow-[-20px_0_30px_rgba(0,0,0,0.3)]">
                            <div className="space-y-1.5 flex flex-col-reverse">
                                {MONEY_ARR.map((money, idx) => {
                                    const isImportant = (idx + 1) % 5 === 0
                                    const isCurrent = idx === curIdx
                                    const isPassed = idx < curIdx
                                    
                                    let cls = "rounded-xl px-4 py-1.5 border flex justify-between font-bold text-sm transition-all "
                                    if (isCurrent) cls += "bg-yellow-500 border-yellow-400 text-slate-950 scale-105 shadow-lg"
                                    else if (isPassed) cls += "bg-emerald-900/30 border-emerald-500/30 text-emerald-500"
                                    else if (isImportant) cls += "bg-transparent border-white/10 text-yellow-500 font-black"
                                    else cls += "bg-transparent border-transparent text-slate-500"
                                    
                                    return (
                                        <div key={idx} className={cls}>
                                            <span className="w-6">{idx + 1}</span>
                                            <span>{money}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALS */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-yellow-500/30 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                        <h3 className="text-2xl font-black text-yellow-400 mb-2">XÁC NHẬN CHẮC CHẮN</h3>
                        <p className="text-slate-300 mb-8 font-bold">Đây là mốc quan trọng. Bạn có chắc chắn với câu trả lời của mình?</p>
                        <div className="flex gap-4">
                            <button onClick={() => confirmFinal(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold">CHƯA CHẮC</button>
                            <button onClick={() => confirmFinal(true)} className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black">CHẮC CHẮN</button>
                        </div>
                    </div>
                </div>
            )}

            {showLifeline.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-blue-500/30 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                        <h3 className="text-xl font-black text-blue-400 mb-6">{showLifeline.title}</h3>
                        <div className="text-white text-lg font-bold mb-8 whitespace-pre-line leading-relaxed">{showLifeline.content}</div>
                        <button onClick={() => setShowLifeline({show: false, type: '', title: '', content: ''})} className="w-full bg-blue-600 hover:bg-blue-500 font-black py-3 rounded-xl">ĐÃ RÕ</button>
                    </div>
                </div>
            )}

            {showResultModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
                    <div className="bg-slate-900 border-2 border-yellow-500/50 p-8 md:p-12 rounded-[2rem] max-w-md w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                        <h2 className="text-3xl font-black text-white mb-4">{finalMessage}</h2>
                        <div className="text-slate-400 font-bold mb-2">PHẦN THƯỞNG CỦA BẠN</div>
                        <div className="text-5xl font-black text-emerald-400 mb-2 drop-shadow-md">
                            {finalPrize} đ
                        </div>
                        <div className="text-xl font-bold text-yellow-400 mb-8">
                            Điểm Bảng Vàng: +{finalRankingScore} pts
                        </div>
                        <button onClick={() => { setShowResultModal(false); setAppState('login'); }} className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-4 rounded-xl shadow-lg uppercase transition-transform hover:scale-105">ĐÃ HIỂU</button>
                    </div>
                </div>
            )}

        </div>
    )
}