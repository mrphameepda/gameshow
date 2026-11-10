// src/services/firebaseService.ts
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast } from 'firebase/database'
import { rtdb } from '@/config/firebase'

const db = getDatabase(rtdb.app)


export interface LeaderboardEntry {
  name: string
  diocese: string
  parish: string
  level: string
  score: number
  timestamp?: number
}

export const saveToLeaderboard = async (data: LeaderboardEntry) => {
  try {
    await push(ref(db, 'leaderboard_vuihoc'), {
      ...data,
      timestamp: Date.now()
    })
    return true
  } catch (error) {
    console.error("Firebase save error:", error)
    return false
  }
}

export const subscribeToLeaderboard = (callback: (data: LeaderboardEntry[]) => void) => {
  const topScoresQuery = query(ref(db, 'leaderboard_vuihoc'), orderByChild('score'), limitToLast(10))
  
  return onValue(topScoresQuery, (snapshot) => {
    const data = snapshot.val()
    if (!data) {
      callback([])
      return
    }
    
    const listArr: LeaderboardEntry[] = []
    for (const id in data) {
      listArr.push(data[id])
    }
    
    // Sort descending by score
    listArr.sort((a, b) => b.score - a.score)
    callback(listArr)
  })
}
