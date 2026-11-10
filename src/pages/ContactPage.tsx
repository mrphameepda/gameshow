import { Send } from 'lucide-react'

export function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-sky-700 text-center mb-6">
          Đóng Góp Ý Kiến & Kết Nối Cùng Ban Phát Triển
        </h1>
        
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto text-lg italic">
          "Chúng con mong nhận sự chia sẻ và đóng góp để phát triển sân chơi tốt hơn. Xin chân thành cảm ơn!"
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form liên hệ */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Gửi góp ý nhanh</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                <input type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Nhập họ tên của bạn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Nhập email liên hệ" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lời nhắn gửi</label>
                <textarea rows={4} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Nhập nội dung góp ý..."></textarea>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                <Send size={18} /> Gửi Ý Kiến
              </button>
            </form>
          </div>

          {/* Thông tin liên hệ */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Kênh liên hệ trực tiếp</h2>
            <div className="space-y-6">
              <a href="mailto:mrphamee@gmail.com" className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 transition-colors border border-slate-100 group">
                <div className="bg-sky-100 text-sky-600 p-3 rounded-full group-hover:scale-110 transition-transform">
                  📧
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Email</h3>
                  <p className="text-slate-600 group-hover:text-sky-600">mrphamee@gmail.com</p>
                </div>
              </a>

              <a href="https://www.facebook.com/teo.gon.5" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 transition-colors border border-slate-100 group">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full group-hover:scale-110 transition-transform">
                  📘
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Facebook</h3>
                  <p className="text-slate-600 group-hover:text-blue-600">Phạm Duy Ái</p>
                </div>
              </a>

              <a href="https://www.tiktok.com/@j.pdasds" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group">
                <div className="bg-slate-200 text-slate-800 p-3 rounded-full group-hover:scale-110 transition-transform">
                  🎵
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">TikTok</h3>
                  <p className="text-slate-600 group-hover:text-slate-900">Joseph Pham</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
