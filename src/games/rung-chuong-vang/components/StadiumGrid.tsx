import type { PlayerSlot as PlayerSlotType } from '../types'

interface StadiumGridProps {
  players: PlayerSlotType[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function StadiumGrid({ players, selectedId, onSelect }: StadiumGridProps) {
  if (players.length === 0) return null

  return (
    <div className="w-full h-full p-2 bg-slate-950/40 rounded-3xl border border-slate-800/80 overflow-y-auto">
      <div className="grid grid-cols-4 gap-3">
        {players.map((p) => {
          const isSelected = p.id === selectedId
          const isOut = p.out

          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              title={p.name}
              className={`
                flex aspect-square flex-col items-center justify-center rounded-2xl
                font-black transition-all duration-300 truncate font-display
                ${isSelected 
                  ? 'ring-4 ring-amber-400 border-2 border-amber-300 bg-amber-400/25 text-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.8)] scale-105 animate-pulse z-10' 
                  : isOut 
                    ? 'bg-slate-950/80 border border-slate-800 text-slate-600 opacity-50 cursor-default' 
                    : 'bg-slate-800 border border-slate-700 text-slate-100 hover:scale-105 hover:bg-slate-700 hover:border-amber-500/30 cursor-pointer shadow-md'
                }
              `}
            >
              <span className="text-sm leading-none truncate w-full text-center px-1">{p.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
