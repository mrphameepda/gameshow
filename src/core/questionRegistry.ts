// src/core/questionRegistry.ts
// Central registry for all game question sets

import type { BaseQuestion, GameId } from '@/types/game'

class QuestionRegistry {
  private store = new Map<GameId, BaseQuestion[]>()

  /** Đăng ký bộ câu hỏi cho một game */
  register(gameId: GameId, questions: BaseQuestion[]): void {
    const existing = this.store.get(gameId) ?? []
    this.store.set(gameId, [...existing, ...questions])
  }

  /** Lấy tất cả câu hỏi của game */
  getAll(gameId: GameId): BaseQuestion[] {
    return this.store.get(gameId) ?? []
  }

  /** Lấy câu hỏi theo danh mục */
  getByCategory(gameId: GameId, category: string): BaseQuestion[] {
    return (this.store.get(gameId) ?? []).filter(q => q.category === category)
  }

  /** Lấy một câu hỏi ngẫu nhiên chưa dùng trong session */
  getRandom(gameId: GameId, category: string, usedIds: Set<string>): BaseQuestion | null {
    const pool = this.getByCategory(gameId, category).filter(q => !usedIds.has(q.id))
    if (pool.length === 0) return null
    return pool[Math.floor(Math.random() * pool.length)]
  }

  /** Xóa toàn bộ câu hỏi của game (dùng khi load set mới) */
  clear(gameId: GameId): void {
    this.store.delete(gameId)
  }

  /** Đếm câu hỏi theo danh mục */
  count(gameId: GameId, category?: string): number {
    if (category) return this.getByCategory(gameId, category).length
    return (this.store.get(gameId) ?? []).length
  }
}

export const questionRegistry = new QuestionRegistry()
