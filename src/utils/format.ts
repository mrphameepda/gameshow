// src/utils/format.ts

/** Format số điểm có dấu phân cách hàng nghìn */
export function formatPoints(points: number): string {
  return points.toLocaleString('vi-VN')
}

/** Format thời gian từ giây → MM:SS */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Format ngày ISO sang dd/mm/yyyy */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Rút gọn tên hiển thị nếu quá dài */
export function truncateName(name: string, maxLen = 18): string {
  return name.length > maxLen ? name.slice(0, maxLen - 1) + '…' : name
}

/** Shuffle mảng (Fisher-Yates) */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Lấy n phần tử ngẫu nhiên từ mảng */
export function sampleN<T>(array: T[], n: number): T[] {
  return shuffle(array).slice(0, n)
}
