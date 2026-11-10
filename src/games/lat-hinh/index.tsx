import HomeButton from '../../components/HomeButton';
import { useState, useEffect, useRef } from 'react'
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast } from 'firebase/database'
import confetti from 'canvas-confetti'
import { Volume2, VolumeX, Maximize, Minimize, XSquare } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import GuestSaveScorePopup from '@/components/GuestSaveScorePopup'
import { rtdb } from '@/config/firebase'

const db = getDatabase(rtdb.app)



// AUDIO
const flipAudio = new Audio('/sounds/lat-hinh/flip.mp3')
const matchAudio = new Audio('/sounds/lat-hinh/match.mp3')
const wrongAudio = new Audio('/sounds/lat-hinh/wrong.mp3')
const winAudio = new Audio('/sounds/lat-hinh/win.mp3')

const playAudio = (a: HTMLAudioElement, loop = false) => {
    a.currentTime = 0
    a.loop = loop
    a.play().catch(()=>{})
}

// IMAGES
const images = [
    "/images/memory/tusi.jpg",
    "/images/memory/thien-than.jpg",
    "/images/memory/pio.jpg",
    "/images/memory/maria.jpg",
    "/images/memory/joseph.jpg",
    "/images/memory/jesus2.jpg",
    "/images/memory/jesus1.jpg",
    "/images/memory/giang-sinh.jpg",
    "/images/memory/francis.jpg",
    "/images/memory/dgh.jpg"
]

export default function MemoryGame() {
    const [appState, setAppState] = useState<'login' | 'playing'>('login')
    const [player, setPlayer] = useState({ name: '', parish: '' })
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    
    // Game State
    const [currentLevel, setCurrentLevel] = useState(1)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [cards, setCards] = useState<any[]>([])
    const [flippedIndices, setFlippedIndices] = useState<number[]>([])
    const [matchedIndices, setMatchedIndices] = useState<number[]>([])
    const [isLock, setIsLock] = useState(false)
    
    const [isMuted, setIsMuted] = useState(false)
    const [projectorMode, setProjectorMode] = useState(false)
    const { currentUser, saveUserScore } = useAuth()
    const [showGuestPopup, setShowGuestPopup] = useState(false)
    const [finalGameScore, setFinalGameScore] = useState(0)
    
    const timerRef = useRef<any>(null)

    useEffect(() => {
        const topQuery = query(ref(db, 'leaderboard_memory'), orderByChild('score'), limitToLast(10))
        const unsub = onValue(topQuery, (snapshot) => {
            const data = snapshot.val()
            if (!data) return setLeaderboard([])
            const list = Object.values(data)
            list.sort((a: any, b: any) => b.score - a.score)
            setLeaderboard(list)
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        flipAudio.muted = isMuted
        matchAudio.muted = isMuted
        wrongAudio.muted = isMuted
        winAudio.muted = isMuted
        winAudio.muted = isMuted
    }, [isMuted])

    useEffect(() => {
        return () => {
            flipAudio.pause(); flipAudio.currentTime = 0;
            matchAudio.pause(); matchAudio.currentTime = 0;
            wrongAudio.pause(); wrongAudio.currentTime = 0;
            winAudio.pause(); winAudio.currentTime = 0;
        }
    }, [])

    useEffect(() => {
        if (appState === 'playing' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        clearInterval(timerRef.current)
                        handleTimeOut()
                        return 0
                    }
                    return t - 1
                })
            }, 1000)
        }
        return () => clearInterval(timerRef.current)
    }, [appState, timeLeft])

    const handleTimeOut = () => {
        playAudio(wrongAudio)
        saveScore(score)
        alert(`Hết giờ! Điểm của bạn: ${score}`)
        window.location.reload()
    }

    const saveScore = async (finalScore: number) => {
        if (!player.name || finalScore <= 0) return
        try {
            const cleanName = player.name.trim().slice(0, 14)
            const cleanParish = player.parish.trim().slice(0, 14)
            await push(ref(db, 'leaderboard_memory'), {
                name: cleanName,
                parish: cleanParish,
                score: finalScore,
                timestamp: Date.now()
            })
        } catch (e) {
            console.error(e)
        }

        // Save to user profile if logged in, otherwise show guest popup
        setFinalGameScore(finalScore)
        if (currentUser) {
            saveUserScore('lat-hinh', 'Thử Thách Trí Nhớ', finalScore)
        } else {
            setTimeout(() => setShowGuestPopup(true), 1500)
        }
    }

    const startGame = () => {
        const cleanName = player.name.trim().slice(0, 14)
        if (!cleanName) {
            alert("Vui lòng nhập họ tên!")
            return
        }
        setPlayer(prev => ({...prev, name: cleanName, parish: prev.parish.trim().slice(0, 14)}))
        setAppState('playing')
        initLevel(1, 0)
    }

    const initLevel = (level: number, currentScore: number) => {
        setCurrentLevel(level)
        setScore(currentScore)
        setTimeLeft(level * 20)
        
        let numPairs = level * 2
        if (numPairs > 10) numPairs = 10
        
        const levelImages = [...images].sort(() => 0.5 - Math.random()).slice(0, numPairs)
        const gameImages = [...levelImages, ...levelImages].sort(() => 0.5 - Math.random())
        
        setCards(gameImages.map((img, i) => ({ id: i, img })))
        setFlippedIndices([])
        setMatchedIndices([])
        setIsLock(false)
    }

    const handleCardClick = (index: number) => {
        if (isLock || flippedIndices.includes(index) || matchedIndices.includes(index)) return
        
        playAudio(flipAudio)
        const newFlipped = [...flippedIndices, index]
        setFlippedIndices(newFlipped)
        
        if (newFlipped.length === 2) {
            setIsLock(true)
            const [i1, i2] = newFlipped
            if (cards[i1].img === cards[i2].img) {
                // Match
                setTimeout(() => {
                    playAudio(matchAudio)
                    setScore(s => s + 10)
                    setMatchedIndices(prev => {
                        const newMatched = [...prev, i1, i2]
                        if (newMatched.length === cards.length) {
                            clearInterval(timerRef.current)
                            setTimeout(() => winLevel(currentLevel, score + 10), 500)
                        }
                        return newMatched
                    })
                    setFlippedIndices([])
                    setIsLock(false)
                }, 400)
            } else {
                // Wrong
                playAudio(wrongAudio)
                setTimeout(() => {
                    setFlippedIndices([])
                    setIsLock(false)
                }, 700)
            }
        }
    }

    const winLevel = (level: number, currentScore: number) => {
        playAudio(winAudio)
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        
        if (level < 5) {
            setTimeout(() => {
                alert(`Tuyệt vời! Bạn đã vượt qua Cấp ${level}. Chuẩn bị Cấp ${level + 1} nhé!`)
                initLevel(level + 1, currentScore)
            }, 1000)
        } else {
            setTimeout(() => {
                alert(`CHÚC MỪNG! Bạn đã chiến thắng tất cả các cấp. Tổng điểm: ${currentScore}`)
                saveScore(currentScore)
                window.location.reload()
            }, 1500)
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

    // Grid sizing
    const numPairs = currentLevel * 2
    let gridColsClass = "grid-cols-2"
    if (numPairs > 4) gridColsClass = "grid-cols-3"
    if (numPairs > 6) gridColsClass = "grid-cols-4"
    if (numPairs > 8) gridColsClass = "grid-cols-4 md:grid-cols-5"

    return (
        <div className="min-h-screen font-display bg-[#0f172a] text-slate-100 flex flex-col overflow-hidden relative" style={{fontFamily: "'Be Vietnam Pro', sans-serif"}}>
            <div className="absolute top-4 left-4 z-50">
                <HomeButton confirmExit={appState === 'playing'} />
            </div>

            {showGuestPopup && (
                <GuestSaveScorePopup
                    score={finalGameScore}
                    gameId="lat-hinh"
                    gameName="Thử Thách Trí Nhớ"
                    onClose={() => setShowGuestPopup(false)}
                />
            )}
            
            {/* LOGIN SCREEN */}
            {appState === 'login' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 bg-cover bg-center" style={{backgroundImage: "linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95))"}}>
                    <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-6 items-center justify-center animate-fade-in-up">
                        <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-6 uppercase text-center tracking-widest drop-shadow-md">THỬ THÁCH<br/>TRÍ NHỚ</h1>
                            <div className="space-y-4">
                                <input type="text" maxLength={14} value={player.name} onChange={e=>setPlayer(prev=>({...prev, name: e.target.value}))} placeholder="👦 Họ và tên..." className="w-full p-4 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold outline-none focus:border-yellow-400 text-center"/>
                                <input type="text" maxLength={14} value={player.parish} onChange={e=>setPlayer(prev=>({...prev, parish: e.target.value}))} placeholder="⛪ Giáo xứ (Tùy chọn)..." className="w-full p-4 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold outline-none focus:border-yellow-400 text-center"/>
                                <button onClick={startGame} className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black py-4 rounded-xl shadow-[0_8px_30px_rgba(234,179,8,0.3)] text-xl uppercase transition-transform hover:scale-105">BẮT ĐẦU CHƠI</button>
                                <div className="text-center text-white/50 text-[10px] uppercase font-bold mt-2">Tác giả: Giuse Phạm Duy Ái, SDS</div>
                            </div>
                        </div>
                        <div className="hidden lg:flex w-80 bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 h-[500px] flex-col shadow-2xl">
                            <h3 className="text-yellow-400 font-black text-center mb-4 uppercase border-b border-white/10 pb-3">🏆 BẢNG VÀNG</h3>
                            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin text-white text-xs pr-2">
                                {leaderboard.length === 0 ? <div className="text-center text-slate-500 italic mt-4">Chưa có ai...</div> : leaderboard.map((v, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <span className={`font-black text-lg ${i < 3 ? 'text-yellow-500' : 'text-slate-400'}`}>{i + 1}</span>
                                        <div className="flex-1 min-w-0 truncate">
                                            <div className="font-bold text-sm truncate">{v.name}</div>
                                            <div className="text-[10px] text-slate-400 uppercase truncate">{v.parish}</div>
                                        </div>
                                        <div className="text-emerald-400 font-black text-sm">{v.score}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MAIN GAME */}
            {appState === 'playing' && (
                <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto my-2 sm:my-4 bg-slate-900/80 border-2 sm:border-4 border-slate-700 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl">
                    <header className="p-2 md:p-4 flex justify-between items-center border-b border-white/10 bg-slate-900/90 shrink-0">
                        <div className="flex items-center gap-2 sm:gap-4">
                            
                            <button onClick={()=>setIsMuted(!isMuted)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-2xl backdrop-saturate-150 bg-slate-900/60 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.25)] hover:border-amber-400/50 hover:bg-slate-800/70 flex items-center justify-center text-yellow-400 transition-all">
                                {isMuted ? <VolumeX size={16} className="text-rose-400"/> : <Volume2 size={16}/>}
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3 md:gap-6 backdrop-blur-2xl backdrop-saturate-150 bg-slate-900/60 px-4 py-2 rounded-full border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.25)]">
                            <div className="text-center">
                                <div className="text-[10px] text-slate-400 font-bold">CẤP</div>
                                <div className="text-lg md:text-xl font-black text-white">{currentLevel}/5</div>
                            </div>
                            <div className="w-px h-8 bg-white/15"></div>
                            <div className="text-center">
                                <div className="text-[10px] text-slate-400 font-bold">ĐIỂM</div>
                                <div className="text-lg md:text-xl font-black text-emerald-400">{score}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-2 sm:border-4 flex items-center justify-center text-base md:text-xl font-black shadow-lg bg-slate-900/60 ${timeLeft <= 5 ? 'border-rose-500 text-rose-500 animate-pulse' : 'border-yellow-500 text-yellow-500'}`}>
                                {timeLeft}
                            </div>
                            <button onClick={()=>window.location.reload()} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-black text-[10px] sm:text-xs uppercase shadow-md flex items-center gap-1 transition-all">
                                <XSquare size={14} className="hidden sm:inline"/> <span>THOÁT</span>
                            </button>
                            <button onClick={toggleFullscreen} className="hidden lg:flex w-10 h-10 rounded-full backdrop-blur-2xl backdrop-saturate-150 bg-slate-900/60 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.25)] hover:border-amber-400/50 hover:bg-slate-800/70 items-center justify-center text-yellow-400 transition-all">
                                {projectorMode ? <Minimize size={16} /> : <Maximize size={16} />}
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
                        {/* LEFT: CARDS */}
                        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center perspective-1000">
                            <div className={`grid ${gridColsClass} gap-3 sm:gap-4 w-full max-w-4xl mx-auto`}>
                                {cards.map((card, i) => {
                                    const isFlipped = flippedIndices.includes(i) || matchedIndices.includes(i)
                                    return (
                                        <div 
                                            key={i}
                                            onClick={() => handleCardClick(i)}
                                            className="relative aspect-[3/4] w-full cursor-pointer perspective-1000 group"
                                        >
                                            <div className={`w-full h-full duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                                {/* BACK OF CARD: Liquid Sapphire */}
                                                <div className="absolute inset-0 backface-hidden rounded-2xl md:rounded-[1.75rem] backdrop-blur-2xl backdrop-saturate-150 bg-slate-900/60 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.25)] flex items-center justify-center group-hover:border-amber-400/50 group-hover:bg-slate-800/70 transition-all">
                                                    <span className="text-4xl md:text-6xl font-black text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">?</span>
                                                </div>
                                                {/* FRONT OF CARD: Acrylic squircle */}
                                                <div className="absolute inset-0 backface-hidden rounded-2xl md:rounded-[1.75rem] bg-slate-900/80 border border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center rotate-y-180">
                                                    <img src={card.img} alt="card" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* RIGHT: LEADERBOARD DESKTOP */}
                        <div className="hidden lg:flex w-80 bg-slate-900/60 backdrop-blur-md border-l border-white/10 p-4 flex-col shadow-inner">
                            <h3 className="text-yellow-400 font-black text-center mb-4 uppercase border-b border-white/10 pb-3">🏆 BẢNG VÀNG</h3>
                            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin text-white text-xs pr-2">
                                {leaderboard.length === 0 ? <div className="text-center text-slate-500 italic mt-4">Chưa có ai...</div> : leaderboard.map((v, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <span className={`font-black text-lg ${i < 3 ? 'text-yellow-500' : 'text-slate-400'}`}>{i + 1}</span>
                                        <div className="flex-1 min-w-0 truncate">
                                            <div className="font-bold text-sm truncate">{v.name}</div>
                                            <div className="text-[10px] text-slate-400 uppercase truncate">{v.parish}</div>
                                        </div>
                                        <div className="text-emerald-400 font-black text-sm">{v.score}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    )
}
