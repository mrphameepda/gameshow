// src/config/gamesList.ts
// Danh sách toàn bộ game hiển thị trên HomePage

export type GameCategory = 'SINH HOẠT' | 'ĐUA TOP' | 'CÔNG CỤ'

export interface GameListItem {
  id: string
  title: string
  category: GameCategory
  status: 'ready' | 'coming_soon'
  route?: string
  badge?: 'HOT' | 'NEW'
  author?: string
  thumbnailUrl?: string
  icon?: string // Lucide icon name fallback
  color: string
}

export const GAMES_LIST: GameListItem[] = [
  {
    id: 'rung-chuong-vang',
    title: 'Rung Chuông Vàng',
    category: 'SINH HOẠT',
    status: 'ready',
    route: '/games/rung-chuong-vang',
    badge: 'HOT',
    author: 'Giuse Phạm Duy Ái, SDS',
    thumbnailUrl: '/images/games/rung-chuong-vang.webp',
    color: '#f59e0b'
  },
  {
    id: 'do-vui-giao-ly',
    title: 'Đố Vui Giáo Lý',
    category: 'ĐUA TOP',
    status: 'ready',
    route: '/games/vui-hoc-giao-ly',
    badge: 'NEW',
    thumbnailUrl: '/images/games/do-vui-giao-ly.webp',
    color: '#3b82f6',
    icon: 'Brain'
  },
  {
    id: 'xo-so',
    title: 'Ứng dụng Xổ Số',
    category: 'SINH HOẠT',
    status: 'ready',
    route: '/games/ung-dung-xo-so',
    badge: 'HOT',
    thumbnailUrl: '/images/games/xo-so.webp',
    color: '#ec4899',
    icon: 'Ticket'
  },
  {
    id: 'tao-quiz',
    title: 'Tạo Quiz Đố Vui',
    category: 'CÔNG CỤ',
    status: 'ready',
    route: '/games/tao-quiz-do-vui',
    thumbnailUrl: '/images/games/tao-quiz.webp',
    color: '#8b5cf6',
    icon: 'FileQuestion'
  },
  {
    id: 'o-chu-cong-giao',
    title: 'Ô Chữ Công Giáo',
    category: 'ĐUA TOP',
    status: 'ready',
    route: '/games/o-chu-cong-giao',
    badge: 'NEW',
    thumbnailUrl: '/images/games/tim-tu.webp',
    color: '#10b981',
    icon: 'Search'
  },
  {
    id: 'lo-to',
    title: 'Lô Tô Công Giáo Trực Tuyến',
    category: 'SINH HOẠT',
    status: 'ready',
    route: '/games/lo-to',
    thumbnailUrl: '/images/games/lo-to.webp',
    color: '#ef4444',
    icon: 'Mic'
  },
  {
    id: 'chiec-non-ky-dieu',
    title: 'Chiếc Nón Kỳ Diệu',
    category: 'SINH HOẠT',
    status: 'ready',
    route: '/games/chiec-non-ky-dieu',
    badge: 'HOT',
    thumbnailUrl: '/images/games/chiec-non-ky-dieu.webp',
    color: '#f97316',
    icon: 'Circle'
  },
  {
    id: 'ai-la-trieu-phu',
    title: 'Ai Là Triệu Phú',
    category: 'ĐUA TOP',
    status: 'ready',
    route: '/games/ai-la-trieu-phu',
    thumbnailUrl: '/images/games/ai-la-trieu-phu.webp',
    color: '#0ea5e9',
    icon: 'HelpCircle'
  },
  {
    id: 'sap-xep-kinh-thanh',
    title: 'Sắp Xếp Câu Kinh Thánh',
    category: 'ĐUA TOP',
    status: 'ready',
    route: '/games/sap-xep-kinh-thanh',
    thumbnailUrl: '/images/games/sap-xep-kinh-thanh.webp',
    color: '#14b8a6',
    icon: 'ListOrdered'
  },
  {
    id: 'lat-hinh',
    title: 'Thử Thách Trí Nhớ',
    category: 'ĐUA TOP',
    status: 'ready',
    route: '/games/lat-hinh',
    thumbnailUrl: '/images/games/lat-hinh.webp',
    color: '#6366f1',
    icon: 'GalleryHorizontalEnd'
  }
]
