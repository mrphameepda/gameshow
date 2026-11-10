// src/core/storage.ts
// Type-safe localStorage wrapper with JSON serialization

class StorageManager {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Quota exceeded – silent fail
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch { /* ignore */ }
  }

  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }
}

export const storage = new StorageManager()
