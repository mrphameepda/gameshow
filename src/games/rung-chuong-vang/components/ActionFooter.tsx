import { UserX, UserCheck, Trophy, RefreshCcw } from 'lucide-react'

interface ActionFooterProps {
  selectedId: string | null
  onEliminate: () => void
  onReinstate: () => void
  onCelebrate: () => void
  onReset?: () => void
}

export function ActionFooter({
  selectedId,
  onEliminate,
  onReinstate,
  onCelebrate,
  onReset,
}: ActionFooterProps) {
  const glassDock = "backdrop-blur-2xl backdrop-saturate-150 bg-slate-900/60 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.25)]"

  return (
    <div className={`p-4 rounded-3xl ${glassDock} flex flex-col gap-3 font-display`}>
      <div className="flex gap-3">
        <button
          onClick={onEliminate}
          disabled={!selectedId}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 font-black text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed border border-rose-500/50"
        >
          <UserX size={18} /> LOẠI
        </button>

        <button
          onClick={onReinstate}
          disabled={!selectedId}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 font-black text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed border border-emerald-500/50"
        >
          <UserCheck size={18} /> VÀO SÂN
        </button>
      </div>

      <button
        onClick={onCelebrate}
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-black text-lg text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/30 active:scale-95 transition-all"
      >
        <Trophy size={22} /> CHIẾN THẮNG
      </button>

      {onReset && (
        <button
          onClick={onReset}
          className="mt-1 py-1 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1 w-max self-center px-4"
        >
          <RefreshCcw size={12} /> Làm mới game toàn bộ
        </button>
      )}
    </div>
  )
}
