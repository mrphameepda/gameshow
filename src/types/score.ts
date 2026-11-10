// src/types/score.ts
import type { GameId } from '@/config/siteConfig'

export interface Score {
  uid: string
  displayName: string
  avatarId: string
  gameId: GameId
  points: number
  correctAnswers: number
  totalQuestions: number
  duration: number      // seconds
  playedAt: string      // ISO 8601
}

export interface LeaderboardEntry {
  rank: number
  uid: string
  displayName: string
  avatarId: string
  points: number
  playedAt: string
}
