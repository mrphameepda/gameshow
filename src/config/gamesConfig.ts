// src/config/gamesConfig.ts
// Danh sách game đăng ký toàn hệ thống – thêm game mới vào đây

import type { GameMeta } from '@/types/game'

export const GAMES_REGISTRY: GameMeta[] = [
  {
    id: 'rung-chuong-vang',
    name: 'Rung Chuông Vàng PRO',
    description: 'Game đối kháng nhóm – Thí sinh trả lời nhanh, sai thì bị loại, đúng thì tiếp tục giữ chuông. Ai trụ vững cuối cùng là Quán quân!',
    icon: '🔔',
    logoPath: '/images/rcv-logo.png',
    tags: ['1–500 thí sinh', 'Máy chiếu', 'Pháo hoa', 'Giáo lý', 'Kinh Thánh'],
    status: 'available',
    route: '/games/rung-chuong-vang',
    accentColor: '#f59e0b',
    maxPlayers: 500,
  },
  {
    id: 'trieu-phu',
    name: 'Ai Là Triệu Phú Đức Tin',
    description: 'Vượt qua 15 câu hỏi Kinh Thánh theo độ khó tăng dần để trở thành Triệu Phú Đức Tin!',
    icon: '💡',
    tags: ['1 người chơi', 'Gợi ý 50/50', 'Leo thang câu hỏi'],
    status: 'coming-soon',
    route: '/games/trieu-phu',
    accentColor: '#8b5cf6',
  },
  {
    id: 'o-chu',
    name: 'Ô Chữ Bí Mật',
    description: 'Giải mã ô chữ ẩn giấu các từ liên quan đến Kinh Thánh và Giáo lý Công giáo!',
    icon: '🔠',
    tags: ['Nhóm', 'Vượt thời gian', 'Giáo lý'],
    status: 'coming-soon',
    route: '/games/o-chu',
    accentColor: '#10b981',
  },
  {
    id: 'dua-thuyen',
    name: 'Đua Thuyền Ga-li-lê',
    description: 'Trả lời đúng để thuyền của bạn tiến về đích! Cuộc đua Kinh Thánh theo chủ đề.',
    icon: '⛵',
    tags: ['2–4 đội', 'Thi đua theo nhóm', 'Vui nhộn'],
    status: 'coming-soon',
    route: '/games/dua-thuyen',
    accentColor: '#0ea5e9',
  },
]

export const getGameById = (id: string): GameMeta | undefined =>
  GAMES_REGISTRY.find(g => g.id === id)
