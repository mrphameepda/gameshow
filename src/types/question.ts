// src/types/question.ts

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type QuestionCategory =
  | 'kinh-thanh'           // Kinh Thánh
  | 'giao-ly'              // Giáo Lý
  | 'lich-su-giao-hoi'     // Lịch Sử Giáo Hội
  | 'cac-thanh'            // Các Thánh
  | 'li-phung'             // Phụng Vụ & Lễ Nghi
  | 'dao-duc'              // Đạo Đức Kitô Giáo
  | 'tong-hop'             // Tổng Hợp

export interface Question {
  id: string
  text: string
  answer: string
  hint?: string
  category: QuestionCategory
  difficulty: DifficultyLevel
  points: number
  mediaUrl?: string        // Hình ảnh / âm thanh gợi ý
  source?: string          // Tham khảo (vd: Mt 5,3)
  tags?: string[]
}
