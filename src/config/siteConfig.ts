// src/config/siteConfig.ts
export const siteConfig = {
  name: 'Gameshow Công Giáo',
  fullName: 'Gameshow Công Giáo – Vui Học Cùng Thầy Giêsu',
  description:
    'Cổng game giáo dục mục vụ Công giáo dành cho thiếu nhi, giới trẻ và cộng đoàn. Khám phá Kinh Thánh, Giáo Lý và các chủ đề đức tin qua những trò chơi tương tác sáng tạo.',
  url: 'https://gameshow.conggiao.vn',
  locale: 'vi_VN',
  twitter: '@gameshowconggiao',
  ogImage: '/og-image.png',
  keywords: [
    'gameshow công giáo',
    'rung chuông vàng giáo lý',
    'game kinh thánh',
    'thiếu nhi công giáo',
    'giáo dục mục vụ',
    'vui học đức tin',
    'quiz công giáo',
  ],
  games: [
    {
      id: 'rung-chuong-vang',
      name: 'Rung Chuông Vàng PRO',
      description: 'Game đối kháng nhóm – Trả lời nhanh, giữ chuông, giành chiến thắng!',
      icon: '🔔',
      color: '#f59e0b',
      available: true,
    },
    {
      id: 'ai-la-trieu-phu',
      name: 'Ai Là Triệu Phú Đức Tin',
      description: 'Vượt qua 15 câu hỏi Kinh Thánh để trở thành triệu phú đức tin!',
      icon: '💡',
      color: '#8b5cf6',
      available: false,
    },
    {
      id: 'vuot-chướng-ngại-vat',
      name: 'Vượt Chướng Ngại Vật',
      description: 'Trả lời đúng để vượt qua các vòng thử thách giáo lý!',
      icon: '🏁',
      color: '#10b981',
      available: false,
    },
  ],
} as const

export type GameId = typeof siteConfig.games[number]['id']
