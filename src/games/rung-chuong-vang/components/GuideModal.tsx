// src/games/rung-chuong-vang/components/GuideModal.tsx
// BẢO TỒN THUẬT NGỮ – Tác giả: Giuse Phạm Duy Ái, SDS

import { X } from 'lucide-react'
import { playSound } from '../index'

export type GuideTab = 'huongdan' | 'thongtin'

interface GuideModalProps {
  tab: GuideTab
  onClose: () => void
}

export function GuideModal({ tab, onClose }: GuideModalProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white p-8 max-h-[88vh] overflow-y-auto text-gray-800 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => { playSound('click'); onClose(); }}
          className="absolute right-5 top-4 rounded-full bg-red-50 p-2 text-red-500 hover:bg-red-100 transition-colors"
          aria-label="Đóng"
        >
          <X size={24} />
        </button>

        {tab === 'huongdan' ? <HuongDan /> : <ThongTin />}
      </div>
    </div>
  )
}

function HuongDan() {
  return (
    <>
      <h2 className="text-blue-600 text-xl font-black border-b-2 border-gray-200 pb-3 mb-4">
        📖 HƯỚNG DẪN CHI TIẾT CÁCH CHƠI &amp; ĐIỀU KHIỂN
      </h2>

      <p className="font-bold mt-3">1. Giai đoạn chuẩn bị (Setup)</p>
      <ul className="list-disc pl-5 space-y-1 mt-1 text-sm leading-relaxed">
        <li>Nhập số lượng thí sinh tham gia (Hệ thống hỗ trợ mượt mà từ 1 đến hơn 500 người).</li>
        <li>Nhập tên/số báo danh thí sinh. Sau đó nhấn <strong>BẮT ĐẦU CHƠI</strong>.</li>
      </ul>

      <p className="font-bold mt-4">2. Lựa chọn &amp; Điều khiển câu hỏi</p>
      <p className="mt-1 text-sm">Quản trò lựa chọn câu hỏi bằng cách nhấn trực tiếp vào các nút phân loại trên màn hình:</p>
      <ul className="list-disc pl-5 space-y-1 mt-1 text-sm leading-relaxed">
        <li><strong>CÂU DỄ / VỪA / KHÓ:</strong> Các câu hỏi tính điểm/loại trực tiếp theo độ khó tăng dần.</li>
        <li><strong>CỨU TRỢ:</strong> Dùng khi thí sinh trên sân còn quá ít. Giám thị có thể cho phép một nhóm hoặc tất cả quay lại sân (Dùng nút <strong>VÀO SÂN</strong>).</li>
        <li><strong>ĐỐ VUI:</strong> Gói câu hỏi đố vui hoặc dành cho khán giả, tạo không khí vui vẻ.</li>
        <li><strong>CÂU PHỤ:</strong> Dùng khi kết thúc các câu chính mà vẫn còn nhiều hơn 1 thí sinh để tìm Quán quân duy nhất.</li>
        <li><strong>GHI CHÚ:</strong> TÙY VÀO DIỄN BIẾN, QUẢN TRÒ CÓ THỂ CHỌN CÂU HỎI TÙY Ý</li>
      </ul>
      <p className="mt-2 italic text-gray-500 text-sm">Quy trình thực hiện: Chọn loại câu ➡️ Phóng to (tùy chọn) ➡️ ⏳ CHẠY GIỜ ➡️ 👁️ ĐÁP ÁN.</p>

      <p className="font-bold mt-4">3. Cách chơi &amp; Quản lý Thí sinh</p>
      <ul className="list-disc pl-5 space-y-1 mt-1 text-sm leading-relaxed">
        <li><strong>Trả lời đúng:</strong> Thí sinh tiếp tục ở lại vị trí.</li>
        <li><strong>Trả lời sai (LOẠI):</strong> Quản trò nhấp vào số báo danh trên màn hình ➡️ Nhấn <strong>❌ LOẠI</strong>. Ô số sẽ bôi đen và phát tiếng "Oh My God".</li>
        <li><strong>Vào sân lại:</strong> Nhấp vào ô đang bị đen ➡️ Nhấn <strong>✅ VÀO SÂN</strong>.</li>
      </ul>

      <p className="font-bold mt-4">4. Vinh danh Quán quân</p>
      <p className="mt-1 text-sm">
        Khi chỉ còn duy nhất 01 người, nhấn nút <strong>🏆 CHIẾN THẮNG</strong>. Màn hình sẽ bùng nổ pháo hoa giấy và nhạc vinh danh rực rỡ.
      </p>
    </>
  )
}

function ThongTin() {
  return (
    <>
      <h2 className="text-purple-600 text-xl font-black border-b-2 border-gray-200 pb-3 mb-4">
        ℹ️ THÔNG TIN HỆ THỐNG
      </h2>
      <p><strong>Tác giả:</strong> Giuse Phạm Duy Ái, SDS</p>
      <p className="mt-2"><strong>Số lượng thí sinh:</strong> Tối ưu 1 - 500 người.</p>
      <p className="mt-2">
        <strong>Liên hệ hỗ trợ/Nâng cấp:</strong>{' '}
        <a href="mailto:admin@cgtd.vn" className="text-blue-600 underline">admin@cgtd.vn</a>
      </p>
      <p className="mt-2">
        <strong>Facebook:</strong>{' '}
        <a href="https://www.facebook.com/teo.gon.5/" target="_blank" rel="noreferrer" className="text-blue-600 underline">
          facebook.com/teo.gon.5/
        </a>
      </p>
      <p className="mt-2">
        <strong>Tiktok:</strong>{' '}
        <a href="https://www.tiktok.com/@j.pdasds" target="_blank" rel="noreferrer" className="text-blue-600 underline">
          @j.pdasds
        </a>
      </p>

      <div className="mt-5 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
        <p className="text-yellow-800 text-sm m-0">
          ⚠️ <strong>Lưu ý:</strong> Hệ thống tự động lưu trận đấu vào bộ nhớ trình duyệt. Bạn có thể Reload trang mà không mất dữ liệu thí sinh!
        </p>
      </div>
    </>
  )
}
