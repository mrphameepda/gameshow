// src/games/rung-chuong-vang/types.ts
// Game-specific types – KHÔNG phụ thuộc vào các game khác

export interface PlayerSlot {
  id: string
  name: string
  out: boolean
}

export type QuizCategory = 'easy' | 'medium' | 'hard' | 'rescue' | 'final' | 'sos'

export const CATEGORY_LABELS: Record<QuizCategory, string> = {
  easy:   'CÂU DỄ',
  medium: 'CÂU VỪA',
  hard:   'CÂU KHÓ',
  rescue: 'CỨU TRỢ',
  final:  'CÂU PHỤ',
  sos:    'ĐỐ VUI',
}

export const CATEGORY_COLORS: Record<QuizCategory, string> = {
  easy:   '#2ecc71',
  medium: '#3498db',
  hard:   '#e74c3c',
  rescue: '#9b59b6',
  final:  '#f39c12',
  sos:    '#1abc9c',
}

export interface SavedRcvGame {
  players: PlayerSlot[]
  savedAt: number
}

export const RCV_SAVE_KEY = 'rcv_save_game_v2'
export const TIMER_SECONDS = 20
