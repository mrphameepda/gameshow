import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { Maximize, Minimize, Ticket, History, Dna, RotateCcw, Link2, Users } from 'lucide-react'
import { rtdb } from '../../config/firebase'
import { ref, set, onValue, onDisconnect, remove, get } from 'firebase/database'

// --- CONSTANTS & TYPES ---
const SPIN_INTERVAL = 60
const NUMBERS = Array.from({ length: 99 }, (_, i) => i + 1)

type TicketData = (number | null)[][]

interface Player {
  id: string
  name: string
  tickets: TicketData[]
}

const spinAudio = new Audio('/sounds/lo-to/spin.mp3')
const tickAudio = new Audio('/sounds/lo-to/tick.mp3')
const winAudio = new Audio('/sounds/lo-to/win.mp3')

const playSound = (type: 'spin' | 'tick' | 'win', loop = false) => {
  try {
    if (type === 'spin') {
      spinAudio.loop = loop
      spinAudio.currentTime = 0
      spinAudio.play().catch(e => console.log(e))
    } else if (type === 'tick') {
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

const stopSound = (type: 'spin') => {
  if (type === 'spin') {
    spinAudio.pause()
    spinAudio.currentTime = 0
  }
}

// --- LOGIC ---
function createSingleTicketData(): TicketData {
  const ticket: TicketData = [
    Array(9).fill(null),
    Array(9).fill(null),
    Array(9).fill(null)
  ]
  for (let row = 0; row < 3; row++) {
    const cols: number[] = []
    while (cols.length < 5) {
      const r = Math.floor(Math.random() * 9)
      if (!cols.includes(r)) cols.push(r)
    }
    cols.forEach(c => {
      let min = c * 10 + 1
      let max = c * 10 + 10
      if (c === 0) max = 9
      if (c === 8) max = 99
      ticket[row][c] = Math.floor(Math.random() * (max - min + 1)) + min
    })
  }
  return ticket
}

export default function LoToGame() {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState(() => new URLSearchParams(window.location.search).get('room') || '')
  const [isHost] = useState(!new URLSearchParams(window.location.search).get('room'))
  const [viewerId] = useState(() => 'v_' + Math.random().toString(36).substring(2, 9))
  
  // Viewer state
  const [viewerStatus, setViewerStatus] = useState<'idle' | 'waiting' | 'approved' | 'rejected'>('idle')
  const [viewerName, setViewerName] = useState('')
  const [viewerTicketType, setViewerTicketType] = useState<'small' | 'large'>('small')

  // Host state
  const [requests, setRequests] = useState<{id: string, name: string, type: 'small'|'large', timestamp: number}[]>([])

  // State
  const [players, setPlayers] = useState<Player[]>([])
  const [pulledNumbers, setPulledNumbers] = useState<number[]>([])
  const [numberPool, setNumberPool] = useState<number[]>(NUMBERS)
  const [isSpinning, setIsSpinning] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [currentNumber, setCurrentNumber] = useState<number | null>(null)
  const [waitingList, setWaitingList] = useState<{playerName: string, waitingNum: number}[]>([])
  
  // Admin form
  const [playerName, setPlayerName] = useState('')
  const [ticketType, setTicketType] = useState<'small' | 'large'>('small')
  
  // UI State
  const [activeTab, setActiveTab] = useState<'stage' | 'tickets' | 'history'>('stage')
  const [projectorMode, setProjectorMode] = useState(false)
  
  const spinIntervalRef = useRef<number | null>(null)

  // --- FIREBASE SYNC ---
  // Host listening to requests
  useEffect(() => {
    if (!isHost || !roomCode) return
    const reqsRef = ref(rtdb, `rooms/loto/${roomCode}/requests`)
    const unsub = onValue(reqsRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        const list = Object.keys(data).map(k => ({ id: k, ...data[k] }))
        list.sort((a: any, b: any) => a.timestamp - b.timestamp)
        setRequests(list)
      } else {
        setRequests([])
      }
    })
    return () => unsub()
  }, [isHost, roomCode])

  // Shared listening to players
  useEffect(() => {
    if (!roomCode) return
    const pRef = ref(rtdb, `rooms/loto/${roomCode}/players`)
    const unsub = onValue(pRef, snap => {
      const data = snap.val()
      if (data) {
        const list = Object.keys(data).map(k => ({ id: k, ...data[k] }))
        setPlayers(list)
        
        if (!isHost && data[viewerId]) {
          setViewerStatus('approved')
        }
      } else {
        setPlayers([])
      }
    })
    return () => unsub()
  }, [roomCode, isHost, viewerId])

  // Viewer listening to own request (for rejection)
  useEffect(() => {
    if (isHost || !roomCode || viewerStatus !== 'waiting') return
    const myReq = ref(rtdb, `rooms/loto/${roomCode}/requests/${viewerId}`)
    const unsub = onValue(myReq, snap => {
      if (!snap.exists()) {
        get(ref(rtdb, `rooms/loto/${roomCode}/players/${viewerId}`)).then(psnap => {
          if (psnap.exists()) {
            setViewerStatus('approved')
          } else {
            setViewerStatus('rejected')
          }
        })
      }
    })
    return () => unsub()
  }, [isHost, roomCode, viewerStatus, viewerId])

  // Viewer listening to status
  useEffect(() => {
    if (isHost || !roomCode) return
    const sRef = ref(rtdb, `rooms/loto/${roomCode}/status`)
    const unsub = onValue(sRef, snap => {
      const data = snap.val()
      if (data) {
        if (data.isSpinning !== undefined && data.isSpinning !== isSpinning) {
          setIsSpinning(data.isSpinning)
          if (data.isSpinning) {
            playSound('spin', true)
            spinIntervalRef.current = window.setInterval(() => {
              setCurrentNumber(Math.floor(Math.random()*99)+1)
            }, SPIN_INTERVAL)
          } else {
            playSound('tick')
            stopSound('spin')
            if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
          }
        }
        
        if (!data.isSpinning) {
          setCurrentNumber(data.currentNumber || null)
        }
        
        setPulledNumbers(data.pulledNumbers || [])
        setNumberPool(data.numberPool || [])
      }
    })
    return () => unsub()
  }, [isHost, roomCode, isSpinning])

  // Cleanup
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
      stopSound('spin')
      tickAudio.pause()
      tickAudio.currentTime = 0
      winAudio.pause()
      winAudio.currentTime = 0
    }
  }, [])

  // Auto check winners
  useEffect(() => {
    if (gameEnded || pulledNumbers.length === 0) return
    let winnerFound = false
    let winnerName = ''
    const currentWaiting: {playerName: string, waitingNum: number}[] = []
    
    for (const p of players) {
      for (const tk of p.tickets) {
        for (const row of tk) {
          const hits = row.filter(n => n && pulledNumbers.includes(n)).length
          if (hits === 5) {
            winnerFound = true
            winnerName = p.name
            break
          }
          if (hits === 4) {
            const waitingNum = row.find(n => n && !pulledNumbers.includes(n))
            if (waitingNum && !currentWaiting.some(w => w.playerName === p.name && w.waitingNum === waitingNum)) {
              currentWaiting.push({ playerName: p.name, waitingNum })
            }
          }
        }
        if (winnerFound) break
      }
      if (winnerFound) break
    }
    
    setWaitingList(currentWaiting)

    if (winnerFound) {
      setGameEnded(true)
      if (isSpinning) {
        setIsSpinning(false)
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
        stopSound('spin')
      }
      playSound('win')
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } })
      setTimeout(() => {
        alert(`🎉 KINH RỒI! CHÚC MỪNG ${winnerName.toUpperCase()}!`)
      }, 500)
    }
  }, [pulledNumbers, players, gameEnded, isSpinning])

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(code)
    window.history.replaceState(null, '', `?room=${code}`)
    
    const roomRef = ref(rtdb, `rooms/loto/${code}`)
    onDisconnect(roomRef).remove()
    set(roomRef, {
      status: {
        isSpinning: false,
        gameEnded: false,
        currentNumber: null,
        pulledNumbers: [],
        numberPool: NUMBERS
      },
      players: players.length > 0 ? Object.fromEntries(players.map(p => [p.id, { name: p.name, tickets: p.tickets }])) : {}
    })
  }

  const handleAddPlayer = () => {
    const name = playerName.trim().slice(0, 25)
    if (!name) return alert("Vui lòng nhập tên người chơi!")
    const count = ticketType === 'small' ? 1 : 3
    const tks: TicketData[] = []
    for (let i = 0; i < count; i++) tks.push(createSingleTicketData())
    
    const pid = Date.now().toString()
    if (roomCode && isHost) {
      set(ref(rtdb, `rooms/loto/${roomCode}/players/${pid}`), { name, tickets: tks })
    } else {
      setPlayers(prev => [...prev, { id: pid, name, tickets: tks }])
    }
    setPlayerName('')
  }

  const approveRequest = (req: any) => {
    const count = req.type === 'small' ? 1 : 3
    const tks: TicketData[] = []
    for (let i = 0; i < count; i++) tks.push(createSingleTicketData())
    set(ref(rtdb, `rooms/loto/${roomCode}/players/${req.id}`), { name: req.name, tickets: tks })
    remove(ref(rtdb, `rooms/loto/${roomCode}/requests/${req.id}`))
  }

  const rejectRequest = (id: string) => {
    remove(ref(rtdb, `rooms/loto/${roomCode}/requests/${id}`))
  }

  const requestTicket = () => {
    const name = viewerName.trim().slice(0, 25)
    if (!name) return alert("Nhập tên!")
    const reqRef = ref(rtdb, `rooms/loto/${roomCode}/requests/${viewerId}`)
    set(reqRef, { name, type: viewerTicketType, timestamp: Date.now() })
    setViewerStatus('waiting')
  }

  const startSpin = () => {
    if (!isHost || isSpinning || numberPool.length === 0 || gameEnded) return
    setIsSpinning(true)
    playSound('spin', true)
    
    if (roomCode) {
      set(ref(rtdb, `rooms/loto/${roomCode}/status/isSpinning`), true)
    }
    
    spinIntervalRef.current = window.setInterval(() => {
      const rand = numberPool[Math.floor(Math.random() * numberPool.length)]
      setCurrentNumber(rand)
    }, SPIN_INTERVAL)
  }

  const stopSpin = () => {
    if (!isHost || !isSpinning) return
    setIsSpinning(false)
    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
    stopSound('spin')
    
    const idx = Math.floor(Math.random() * numberPool.length)
    const newPool = [...numberPool]
    const res = newPool.splice(idx, 1)[0]
    
    const newPulled = [res, ...pulledNumbers]
    setNumberPool(newPool)
    setPulledNumbers(newPulled)
    setCurrentNumber(res)
    playSound('tick')

    if (roomCode) {
      set(ref(rtdb, `rooms/loto/${roomCode}/status`), {
        isSpinning: false,
        currentNumber: res,
        pulledNumbers: newPulled,
        numberPool: newPool
      })
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err))
      setProjectorMode(true)
    } else {
      document.exitFullscreen()
      setProjectorMode(false)
    }
  }

  const startNewGame = () => {
    if (!isHost) return
    if (window.confirm("Bạn có chắc chắn muốn chơi ván mới? (Số đã ra sẽ bị xóa, người chơi sẽ nhận vé mới)")) {
      setPulledNumbers([])
      setNumberPool([...NUMBERS])
      setCurrentNumber(null)
      setGameEnded(false)
      setIsSpinning(false)
      setWaitingList([])
      
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
      stopSound('spin')

      const newPlayers = players.map(p => {
        const count = p.tickets.length
        const tks: TicketData[] = []
        for (let i = 0; i < count; i++) tks.push(createSingleTicketData())
        return { ...p, tickets: tks }
      })

      if (roomCode) {
        set(ref(rtdb, `rooms/loto/${roomCode}/status`), {
          isSpinning: false,
          currentNumber: null,
          pulledNumbers: [],
          numberPool: [...NUMBERS]
        })
        const playersObj = Object.fromEntries(newPlayers.map(p => [p.id, { name: p.name, tickets: p.tickets }]))
        set(ref(rtdb, `rooms/loto/${roomCode}/players`), playersObj)
      } else {
        setPlayers(newPlayers)
      }
    }
  }

  return (
    <div 
      className="min-h-screen flex flex-col font-display bg-slate-950/40 backdrop-blur-sm text-slate-100 pb-20 lg:pb-0"
      style={{ backgroundImage: "url('/images/lo-to/bk.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      {/* HEADER */}
      <header className="w-full flex items-center justify-between p-2 md:p-4 bg-slate-900/40 backdrop-blur-md border-b border-white/10 z-40 relative">
        {/* CỤM BÊN TRÁI: SẢNH GAME + LÔ TÔ + PHÒNG ONLINE */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold whitespace-nowrap active:scale-95 transition-all"
          >
            🏠 Sảnh
          </button>

          <h1 className="hidden md:block font-black text-xl lg:text-2xl text-red-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] relative">
            LÔ TÔ
          </h1>

          {isHost && !roomCode && (
            <button 
              onClick={createRoom}
              className="flex items-center justify-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-md px-3 py-1.5 text-xs sm:text-sm font-bold text-white transition-all whitespace-nowrap active:scale-95"
            >
              <Users size={16} /> <span className="hidden sm:inline">TẠO PHÒNG ONLINE</span><span className="sm:hidden">ONLINE</span>
            </button>
          )}
          {roomCode && (
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-slate-800/80 border border-white/15 shadow-md px-3 py-1.5 text-xs sm:text-sm font-bold text-white">
              <Link2 size={14} className="text-amber-400" /> 
              PHÒNG: <span className="text-amber-400">{roomCode}</span>
            </div>
          )}
        </div>

        {/* CỤM BÊN PHẢI: NÚT VÁN MỚI + FULLSCREEN */}
        <div className="flex items-center gap-2">
          {isHost && (
            <button 
              onClick={startNewGame}
              className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 shadow-md px-3 py-1.5 text-xs sm:text-sm font-bold text-white transition-all whitespace-nowrap active:scale-95"
            >
              <RotateCcw size={16} /> <span className="hidden sm:inline">Ván Mới</span>
            </button>
          )}
          <button 
            onClick={toggleFullscreen}
            className="rounded-full bg-slate-800/60 border border-white/15 shadow-md p-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-all active:scale-95"
          >
            {projectorMode ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </header>

      {/* MOBILE TABS */}
      <div className="lg:hidden flex border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <button 
          onClick={() => setActiveTab('stage')} 
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'stage' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}`}
        >
          <Dna size={16} /> Quay Số
        </button>
        <button 
          onClick={() => setActiveTab('tickets')} 
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'tickets' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}`}
        >
          <Ticket size={16} /> Vé Chơi
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'history' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}`}
        >
          <History size={16} /> Lịch Sử
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:grid lg:grid-cols-12 lg:gap-6 items-start relative z-10 overflow-hidden">
        
        {/* LEFT COL: TICKETS & ADMIN */}
        <div className={`lg:col-span-4 h-full flex flex-col gap-4 ${activeTab !== 'tickets' ? 'hidden lg:flex' : 'flex'}`}>
          {isHost ? (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-4 shadow-2xl shrink-0">
              <h3 className="font-bold text-amber-400 mb-3 text-center uppercase">Phát Vé Mới (Thủ Công)</h3>
              <div className="flex flex-col gap-3">
                <input 
                  type="text" 
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  maxLength={25}
                  placeholder="Tên người chơi..." 
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500"
                />
                <div className="flex gap-2">
                  <select 
                    value={ticketType} 
                    onChange={e => setTicketType(e.target.value as any)}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-2 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="small">Vé Nhỏ (1 tờ)</option>
                    <option value="large">Vé Lớn (Bộ 3)</option>
                  </select>
                  <button 
                    onClick={handleAddPlayer}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-2 transition-colors shadow-lg shadow-emerald-600/30"
                  >
                    + PHÁT VÉ
                  </button>
                </div>
              </div>
              
              {requests.length > 0 && (
                <div className="mt-4 bg-amber-500/10 border border-amber-500 rounded-2xl p-3 shadow-lg">
                  <h4 className="text-amber-400 font-bold mb-2">🔔 Có người xin vé ({requests.length})</h4>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                    {requests.map(req => (
                      <div key={req.id} className="flex items-center justify-between bg-slate-900 rounded-lg p-2">
                        <span className="text-sm font-bold truncate">👤 {req.name} <span className="text-slate-400 font-normal">({req.type==='small'?'1 tờ':'3 tờ'})</span></span>
                        <div className="flex gap-1">
                          <button onClick={() => approveRequest(req)} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-md text-xs font-bold text-white transition-colors">Duyệt</button>
                          <button onClick={() => rejectRequest(req.id)} className="bg-rose-600 hover:bg-rose-500 px-3 py-1 rounded-md text-xs font-bold text-white transition-colors">Từ chối</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-4 shadow-2xl shrink-0">
              <h3 className="font-bold text-amber-400 mb-3 text-center uppercase">Lấy Vé Tham Gia</h3>
              
              {viewerStatus === 'idle' && (
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    value={viewerName}
                    onChange={e => setViewerName(e.target.value)}
                    maxLength={25}
                    placeholder="Tên của bạn..." 
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500"
                  />
                  <select 
                    value={viewerTicketType} 
                    onChange={e => setViewerTicketType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-2 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="small">Vé Nhỏ (1 tờ)</option>
                    <option value="large">Vé Lớn (Bộ 3)</option>
                  </select>
                  <button 
                    onClick={requestTicket}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-3 transition-colors shadow-lg shadow-emerald-600/30"
                  >
                    📩 GỬI YÊU CẦU LẤY VÉ
                  </button>
                </div>
              )}
              
              {viewerStatus === 'waiting' && (
                <div className="text-center py-6 animate-pulse">
                  <div className="text-4xl mb-2">⏳</div>
                  <p className="font-bold text-amber-400">Đang chờ Chủ phòng duyệt cấp vé...</p>
                </div>
              )}
              
              {viewerStatus === 'rejected' && (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">❌</div>
                  <p className="font-bold text-rose-400 mb-4">Chủ phòng đã từ chối.</p>
                  <button 
                    onClick={() => setViewerStatus('idle')}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl py-2 px-6 transition-colors"
                  >
                    Thử Lại
                  </button>
                </div>
              )}
              
              {viewerStatus === 'approved' && (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="font-bold text-emerald-400">Bạn đã nhận được vé!</p>
                  <p className="text-sm text-slate-400 mt-1">Vé của bạn nằm trong danh sách bên dưới.</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-4 shadow-2xl flex-1 overflow-y-auto min-h-[50vh] lg:min-h-0 scrollbar-thin">
            <h3 className="font-bold text-amber-400 mb-3 text-center uppercase sticky top-0 bg-slate-900/90 py-2 z-10">🎫 Vé Đang Chơi ({players.length})</h3>
            <div className="flex flex-col gap-4">
              {players.map(p => {
                const isMe = p.id === viewerId
                return (
                  <div key={p.id} className={`bg-white rounded-2xl p-2 pb-3 shadow-md border-t-4 ${isMe ? 'border-emerald-500 ring-2 ring-emerald-500' : 'border-rose-500'}`}>
                    <div className={`font-black text-sm text-center mb-2 truncate max-w-full min-w-0 ${isMe ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isMe && "★ BẠN: "}👤 {p.name.toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-2">
                      {p.tickets.map((tk, idx) => (
                        <table key={idx} className="w-full border-collapse table-fixed bg-white">
                          <tbody>
                            {tk.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((num, cIdx) => {
                                  const isHit = num && pulledNumbers.includes(num)
                                  return (
                                    <td 
                                      key={cIdx} 
                                      className={`border border-slate-300 h-7 text-center font-black text-xs sm:text-sm transition-all duration-300 ${
                                        !num ? 'bg-slate-200/50' : 
                                        isHit ? 'bg-emerald-500 text-white shadow-inner animate-pulse' : 'text-slate-800'
                                      }`}
                                    >
                                      {num || ''}
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ))}
                    </div>
                  </div>
                )
              })}
              {players.length === 0 && (
                <p className="text-center text-slate-500 text-sm mt-10 italic">Chưa có vé nào được phát...</p>
              )}
            </div>
          </div>
        </div>

        {/* CENTER COL: STAGE */}
        <div className={`lg:col-span-5 h-full flex flex-col items-center justify-center ${activeTab !== 'stage' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] rounded-full border-8 border-amber-500/80 bg-black/60 shadow-[0_0_50px_rgba(245,158,11,0.4),inset_0_0_30px_rgba(255,255,255,0.2)] overflow-hidden flex items-center justify-center mb-8">
            {/* Balls visualization */}
            <div className={`absolute inset-0 transition-transform duration-700 ${isSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
              {Array.from({length: 30}).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-black text-[10px] sm:text-xs shadow-inner"
                  style={{
                    background: `hsl(${(i * 37) % 360}, 80%, 60%)`,
                    left: `${15 + (i * 7) % 70}%`,
                    top: `${15 + (i * 13) % 70}%`,
                    transform: isSpinning ? `translate(${Math.random()*40-20}px, ${Math.random()*40-20}px)` : 'none',
                    transition: 'transform 0.1s'
                  }}
                >
                  {Math.floor(Math.random()*99)+1}
                </div>
              ))}
            </div>
            {/* Center glass overlay to make it look like a sphere */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
          </div>

          <div className="font-display text-8xl sm:text-[150px] font-black text-amber-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)] leading-none mb-4 tracking-tighter">
            {currentNumber !== null ? (currentNumber < 10 ? `0${currentNumber}` : currentNumber) : '00'}
          </div>
          
          {waitingList.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4 max-h-24 sm:max-h-32 overflow-y-auto px-2 scrollbar-thin w-full max-w-lg">
              {waitingList.map((w, i) => (
                <div key={i} className="animate-pulse border border-amber-400 bg-amber-500/20 text-amber-300 font-black px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  🔥 {w.playerName.toUpperCase()} CHỜ {w.waitingNum < 10 ? `0${w.waitingNum}` : w.waitingNum} 🔥
                </div>
              ))}
            </div>
          )}

          <div className="text-xl font-bold text-amber-500/80 mb-6">
            Số còn lại: {numberPool.length}
          </div>

          <div className="flex gap-4 w-full max-w-sm px-4">
            {isHost ? (
              !isSpinning ? (
                <button 
                  onClick={startSpin}
                  disabled={numberPool.length === 0 || gameEnded}
                  className="flex-1 rounded-full backdrop-blur-2xl bg-emerald-600/90 border border-white/20 shadow-[0_8px_32px_0_rgba(16,185,129,0.4)] py-4 sm:py-5 text-xl sm:text-2xl font-black text-white hover:bg-emerald-500 transition-all disabled:opacity-50"
                >
                  QUAY SỐ
                </button>
              ) : (
                <button 
                  onClick={stopSpin}
                  className="flex-1 rounded-full backdrop-blur-2xl bg-rose-600/90 border border-white/20 shadow-[0_8px_32px_0_rgba(225,29,72,0.4)] py-4 sm:py-5 text-xl sm:text-2xl font-black text-white hover:bg-rose-500 transition-all animate-pulse"
                >
                  CHỐT SỐ
                </button>
              )
            ) : (
              <div className="flex-1 text-center bg-slate-800/80 rounded-full py-4 sm:py-5 text-slate-400 font-bold border border-white/10 shadow-inner">
                {gameEnded ? "Trò chơi kết thúc!" : "Chủ phòng đang điều khiển quay số..."}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COL: HISTORY */}
        <div className={`lg:col-span-3 h-full flex flex-col ${activeTab !== 'history' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-4 shadow-2xl flex-1 overflow-y-auto min-h-[50vh] lg:min-h-0 scrollbar-thin">
            <h3 className="font-bold text-amber-400 mb-4 text-center uppercase sticky top-0 bg-slate-900/90 py-2 z-10">📜 Số Đã Ra ({pulledNumbers.length})</h3>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 p-2">
              {pulledNumbers.map((num, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    i === 0 
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300 scale-105' 
                      : 'bg-white/90 text-slate-900 border border-slate-300'
                  }`}
                >
                  {num < 10 ? `0${num}` : num}
                </div>
              ))}
            </div>
            {pulledNumbers.length === 0 && (
              <p className="text-center text-slate-500 text-sm mt-10 italic">Chưa có số nào được rút...</p>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
