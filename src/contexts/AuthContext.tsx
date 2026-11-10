// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword as fbUpdatePassword,
  type User
} from 'firebase/auth'
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue
} from 'firebase/database'
import { auth, rtdb } from '@/config/firebase'
import { getAvatarByName } from '../utils/avatarHelper'
import type { UserProfile } from '@/types/user'

// Alias ngắn gọn cho Realtime Database (để các hàm bên dưới dùng tên `db` như cũ)
const db = getDatabase(rtdb.app)

// Re-export để các component vẫn import được từ AuthContext
export type { UserProfile, GameScore, GuestbookEntry, DailyCheckIn } from '@/types/user'

export interface PendingScore {
  gameId: string
  gameName: string
  score: number
}

interface AuthContextType {
  currentUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  pendingScore: PendingScore | null
  setPendingScore: (ps: PendingScore | null) => void
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, profile: { displayName: string, parish: string, diocese: string, avatarUrl?: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { displayName?: string, parish?: string, diocese?: string, avatarUrl?: string }) => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  saveUserScore: (gameId: string, gameName: string, score: number) => Promise<boolean>
  convertScoreToCoins: (amount: number) => Promise<boolean>
  buyItem: (itemId: string, price: number, isSticker?: boolean) => Promise<boolean>
  equipRoomItem: (slotId: string, itemId: string | null) => Promise<boolean>
  showAuthModal: boolean
  setShowAuthModal: (v: boolean) => void
  showProfileModal: boolean
  setShowProfileModal: (v: boolean) => void
  viewingUserId: string | null
  viewingUserName: string | null
  setViewingUser: (id: string | null, name: string | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingScore, setPendingScore] = useState<PendingScore | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [viewingUserId, setViewingUserId] = useState<string | null>(null)
  const [viewingUserName, setViewingUserName] = useState<string | null>(null)

  const setViewingUser = (id: string | null, name: string | null) => {
    setViewingUserId(id)
    setViewingUserName(name)
  }

  // Load pending score from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('pendingScore')
    if (stored) {
      try { setPendingScore(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [])

  // Sync pending score to sessionStorage
  useEffect(() => {
    if (pendingScore) {
      sessionStorage.setItem('pendingScore', JSON.stringify(pendingScore))
    } else {
      sessionStorage.removeItem('pendingScore')
    }
  }, [pendingScore])

  // Listen to Firebase Auth state & Real-time Profile
  useEffect(() => {
    let profileUnsub: (() => void) | undefined;
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        profileUnsub = onValue(userRef, (snap) => {
          if (snap.exists()) {
            setUserProfile(snap.val() as UserProfile)
          }
        })
      } else {
        setUserProfile(null)
        if (profileUnsub) profileUnsub();
      }
      setLoading(false)
    })
    return () => {
      unsub()
      if (profileUnsub) profileUnsub();
    }
  }, [])

  // After login, if there's a pending score, auto-save it
  useEffect(() => {
    if (currentUser && pendingScore) {
      saveUserScore(pendingScore.gameId, pendingScore.gameName, pendingScore.score).then(ok => {
        if (ok) {
          setPendingScore(null)
        }
      })
    }
  }, [currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadProfile = async (uid: string) => {
    const snap = await get(ref(db, `users/${uid}`))
    if (snap.exists()) {
      setUserProfile(snap.val() as UserProfile)
    }
  }

  const cleanUsernameForEmail = (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '')
  }

  const getDummyEmail = (username: string) => {
    return cleanUsernameForEmail(username) + "@vericath.local"
  }

  const login = async (username: string, password: string) => {
    const dummyEmail = getDummyEmail(username)
    await signInWithEmailAndPassword(auth, dummyEmail, password)
  }

  const register = async (
    username: string,
    password: string,
    profile: { displayName: string, parish: string, diocese: string, avatarUrl?: string }
  ) => {
    const formattedUsername = cleanUsernameForEmail(username)
    const dummyEmail = formattedUsername + "@vericath.local"
    let cred;
    try {
      cred = await createUserWithEmailAndPassword(auth, dummyEmail, password)
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        const suggestions = [
          formattedUsername + "123",
          formattedUsername + Math.floor(Math.random() * 999)
        ]
        throw { code: 'username-already-in-use', suggestions }
      }
      throw error
    }

    const newProfile: UserProfile = {
      displayName: profile.displayName.trim().slice(0, 25),
      parish: profile.parish.trim().slice(0, 30),
      diocese: profile.diocese.trim().slice(0, 30),
      avatarUrl: profile.avatarUrl || getAvatarByName(profile.displayName),
      totalScore: 0,
      coins: 0,
      gameScores: {},
      createdAt: Date.now()
    }
    await set(ref(db, `users/${cred.user.uid}`), newProfile)
    setUserProfile(newProfile)
  }

  const logout = async () => {
    await signOut(auth)
    setUserProfile(null)
    setShowProfileModal(false)
    window.location.href = '/'
  }

  const updateProfile = async (data: { displayName?: string, parish?: string, diocese?: string, avatarUrl?: string }) => {
    if (!currentUser) return
    const updates: Record<string, string> = {}
    if (data.displayName !== undefined) updates.displayName = data.displayName.trim().slice(0, 25)
    if (data.parish !== undefined) updates.parish = data.parish.trim().slice(0, 30)
    if (data.diocese !== undefined) updates.diocese = data.diocese.trim().slice(0, 30)
    if (data.avatarUrl !== undefined) updates.avatarUrl = data.avatarUrl
    await update(ref(db, `users/${currentUser.uid}`), updates)
    setUserProfile(prev => prev ? { ...prev, ...updates } : prev)
  }

  const changePassword = async (newPassword: string) => {
    if (!currentUser) throw new Error('Chưa đăng nhập')
    await fbUpdatePassword(currentUser, newPassword)
  }

  const saveUserScore = async (gameId: string, gameName: string, score: number): Promise<boolean> => {
    if (!currentUser || !userProfile) return false
    try {
      // SANITY CHECK: Chặn trần điểm tối đa, chống hack/bug
      if (score > 2500) {
        console.warn(`[Cảnh Báo An Ninh] Phát hiện điểm số bất thường từ game ${gameId}: ${score} pts. Đã chặn lệnh lưu để chống lạm phát.`);
        return false;
      }
      let finalScore = score;

      const existing = userProfile.gameScores?.[gameId]
      const bestScore = existing ? Math.max(existing.bestScore, finalScore) : finalScore
      const playCount = existing ? existing.playCount + 1 : 1

      const gameScoreUpdate = {
        bestScore,
        playCount,
        lastPlayed: Date.now(),
        gameName
      }

      // Tính tổng trên dữ liệu mới nhất
      let total = 0
      for (const gid in userProfile.gameScores) {
        if (gid !== gameId) {
          total += userProfile.gameScores[gid].bestScore
        }
      }
      total += bestScore

      // Gom tất cả vào 1 lệnh update duy nhất (Atomic Multi-path Update)
      const updates = {
        [`users/${currentUser.uid}/gameScores/${gameId}`]: gameScoreUpdate,
        [`users/${currentUser.uid}/totalScore`]: total
      }
      await update(ref(db), updates)

      // Cập nhật lại UI state cục bộ
      const newProfile = { ...userProfile }
      newProfile.gameScores = { ...newProfile.gameScores, [gameId]: gameScoreUpdate }
      newProfile.totalScore = total
      setUserProfile(newProfile)

      return true
    } catch (e) {
      console.error('saveUserScore error:', e)
      return false
    }
  }

  const convertScoreToCoins = async (amount: number): Promise<boolean> => {
    if (!currentUser || !userProfile) return false
    if (userProfile.totalScore < amount) return false
    try {
      const updates = {
        totalScore: userProfile.totalScore - amount,
        coins: (userProfile.coins || 0) + amount
      }
      await update(ref(db, `users/${currentUser.uid}`), updates)
      setUserProfile(prev => prev ? { ...prev, ...updates } : prev)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const buyItem = async (itemId: string, price: number, isSticker: boolean = false): Promise<boolean> => {
    if (!currentUser || !userProfile) return false
    if ((userProfile.coins || 0) < price) return false
    
    // Kiểm tra xem đã sở hữu chưa
    if (isSticker && userProfile.stickers?.[itemId]) return false
    if (!isSticker && userProfile.inventory?.[itemId]) return false

    try {
      const updates: Record<string, unknown> = {
        coins: (userProfile.coins || 0) - price
      }
      if (isSticker) {
        updates[`stickers/${itemId}`] = true
      } else {
        updates[`inventory/${itemId}`] = true
      }
      await update(ref(db, `users/${currentUser.uid}`), updates)
      loadProfile(currentUser.uid)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const equipRoomItem = async (slotId: string, itemId: string | null): Promise<boolean> => {
    if (!currentUser || !userProfile) return false
    try {
      if (itemId === null) {
        // Unequip
        await set(ref(db, `users/${currentUser.uid}/roomLayout/${slotId}`), null)
      } else {
        // Equip
        await update(ref(db, `users/${currentUser.uid}/roomLayout`), {
          [slotId]: itemId
        })
      }
      loadProfile(currentUser.uid)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{
      currentUser, userProfile, loading,
      pendingScore, setPendingScore,
      login, register, logout,
      updateProfile, changePassword, saveUserScore,
      convertScoreToCoins, buyItem, equipRoomItem,
      showAuthModal, setShowAuthModal,
      showProfileModal, setShowProfileModal,
      viewingUserId, viewingUserName, setViewingUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}
