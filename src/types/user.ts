// src/types/user.ts
// ================================================================
// Interface CANONICAL của UserProfile — khớp cấu trúc Firebase RTDB
// tại node: users/{uid}
// ================================================================

export interface GameScore {
  bestScore: number
  playCount: number
  lastPlayed: number // Unix timestamp (ms)
  gameName?: string
}

export interface DailyCheckIn {
  lastCheckInDate: string // 'YYYY-MM-DD'
  checkInCount?: number
}

export interface GuestbookEntry {
  senderName: string
  senderUid: string
  text: string
  timestamp: number
}

export interface UserProfile {
  displayName: string
  parish: string
  diocese: string
  avatarUrl?: string
  totalScore: number
  coins: number
  gameScores?: Record<string, GameScore>
  createdAt: number
  dailyCheckIn?: DailyCheckIn
  stickers?: Record<string, boolean>
  badges?: Record<string, boolean>
  likes?: Record<string, boolean>
  guestbook?: Record<string, GuestbookEntry>
  inventory?: Record<string, boolean>
  roomLayout?: Record<string, string>
}

/** Alias ngắn gọn dùng trong session game */
export interface User {
  uid: string
  displayName: string
  avatarUrl?: string
}
