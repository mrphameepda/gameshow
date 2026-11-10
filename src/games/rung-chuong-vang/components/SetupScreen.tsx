// src/games/rung-chuong-vang/components/SetupScreen.tsx
import { useState, useRef } from 'react'
import { BookOpen, Info, Play } from 'lucide-react'
import { playSound } from '../index'
import type { GuideTab } from './GuideModal'

interface SetupScreenProps {
  onStart: (names: string[]) => void
  onOpenGuide: (tab: GuideTab) => void
  onOpenSelector?: () => void
}

export function SetupScreen({ onStart, onOpenGuide, onOpenSelector }: SetupScreenProps) {
  const [count, setCount] = useState(50)
  const [step, setStep] = useState<'count' | 'names'>('count')
  const [names, setNames] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleNext = () => {
    playSound('click')
    const n = Math.max(1, Math.min(500, count))
    const defaults = Array.from({ length: n }, (_, i) => String(i + 1))
    setNames(defaults)
    setStep('names')
  }

  const handleNamesChange = (val: string) => {
    const parsed = val.split('\n').map(s => s.trim()).filter(Boolean)
    setNames(parsed)
  }

  const handleStart = () => {
    if (names.length === 0) return
    onStart(names)
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
      style={{ backgroundImage: "url('/images/bk1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      <div className="w-full max-w-lg rounded-[2rem] border border-white/20 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex justify-center">
          <img src="/images/rcv-logo.png" alt="Logo Rung Chuông Vàng" className="h-24 object-contain drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>
        
        <h1
          className="mb-1 font-display text-4xl font-black uppercase tracking-tight"
          style={{
            background: 'linear-gradient(#f59e0b, #ea580c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(2px 3px 0 #b91c1c)',
          }}
        >
          Rung Chuông Vàng PRO
        </h1>
        <p className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
          Giuse Phạm Duy Ái, SDS
        </p>

        {step === 'count' ? (
          <>
            <p className="mb-3 text-lg font-black text-amber-300 drop-shadow-sm">Nhập số lượng thí sinh tham gia:</p>
            <input
              type="number"
              value={count}
              min={1}
              max={500}
              onChange={e => setCount(Number(e.target.value))}
              className="mb-5 w-3/5 rounded-2xl border-2 border-amber-400/50 bg-white/10 px-4 py-3 text-center font-display text-3xl font-black text-amber-400 outline-none focus:border-amber-400 focus:bg-white/20 transition-all shadow-inner"
            />

            <div className="mb-5 flex justify-center gap-3">
              <RcvBtn color="#ff9800" onClick={() => { playSound('click'); onOpenGuide('huongdan'); }}>
                <BookOpen size={16} /> HƯỚNG DẪN
              </RcvBtn>
              <RcvBtn color="#9c27b0" onClick={() => { playSound('click'); onOpenGuide('thongtin'); }}>
                <Info size={16} /> THÔNG TIN
              </RcvBtn>
              {onOpenSelector && (
                <RcvBtn color="#14b8a6" onClick={() => { playSound('click'); onOpenSelector(); }}>
                  <BookOpen size={16} /> BỘ CÂU HỎI
                </RcvBtn>
              )}
            </div>

            <RcvBtn color="#2196f3" fullWidth onClick={handleNext}>
              TIẾP THEO ➡️
            </RcvBtn>
          </>
        ) : (
          <>
            <p className="mb-2 font-bold text-slate-300">
              Danh sách <span className="font-black text-amber-400">{names.length}</span> thí sinh
              <span className="ml-2 text-xs text-slate-400">(mỗi tên/số 1 dòng)</span>
            </p>
            <textarea
              ref={textareaRef}
              defaultValue={names.join('\n')}
              onChange={e => handleNamesChange(e.target.value)}
              rows={8}
              className="w-full resize-none rounded-2xl border-2 border-dashed border-amber-400/30 bg-slate-950/50 p-4 font-mono text-sm text-slate-200 outline-none focus:border-amber-400/80 transition-all scrollbar-thin"
              placeholder="Nhập tên hoặc số báo danh, mỗi người một dòng..."
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { playSound('click'); setStep('count'); }}
                className="flex-1 rounded-2xl border border-slate-600 py-3 font-bold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                ← Quay lại
              </button>
              <button
                onClick={handleStart}
                disabled={names.length === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 font-display text-lg font-black text-slate-950 transition-all disabled:opacity-40 hover:bg-amber-300 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
              >
                <Play size={20} className="fill-slate-950" /> BẮT ĐẦU CHƠI 🚀
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function RcvBtn({ color, onClick, children, fullWidth }: { color: string, onClick?: () => void, children: React.ReactNode, fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-2xl px-5 py-3 font-display text-sm font-black text-white transition-all active:translate-y-1 active:shadow-none ${fullWidth ? 'w-full text-lg py-4' : ''}`}
      style={{ background: color, boxShadow: `0 5px 0 rgba(0,0,0,0.25)` }}
    >
      {children}
    </button>
  )
}
