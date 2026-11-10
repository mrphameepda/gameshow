// src/types/game.ts
// Core multi-game type definitions

export type GameId = 'rung-chuong-vang' | 'trieu-phu' | 'o-chu' | 'dua-thuyen' | (string & {})

export type TargetAudience = 'thieu-nhi' | 'gioi-tre' | 'chung'

export type GameStatus = 'available' | 'coming-soon' | 'beta'

export interface BaseQuestion {
  id: string
  gameId: GameId
  audience: TargetAudience
  category: string      // 'easy' | 'medium' | 'hard' | 'rescue' | 'final' | 'sos' | ...
  q: string
  options: string[]     // options[0] là đáp án đúng (trước khi shuffle)
  correct: string       // === options[0]
  tags?: string[]
}

export interface GameMeta {
  id: GameId
  name: string
  description: string
  icon: string          // emoji hoặc path ảnh
  logoPath?: string     // public/images/...
  tags: string[]
  status: GameStatus
  route: string
  accentColor: string
  maxPlayers?: number
}
