import { Link, useLocation } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Footer() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <footer className={`${isHome ? 'bg-transparent border-t border-sky-200 text-sky-800' : 'bg-slate-50 border-t border-slate-200 text-slate-600'} pt-12 pb-6 mt-16 relative z-10`}>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        
        {/* CỘT 1 */}
        <div className="flex flex-col gap-3">
          <h2 className={`font-display font-black text-xl ${isHome ? 'text-sky-900' : 'text-sky-700'}`}>
            VUI HỌC CÙNG THẦY GIÊSU
          </h2>
          <p className={`text-sm leading-relaxed max-w-sm ${isHome ? 'text-sky-700' : 'text-slate-600'}`}>
            Chúng con mong nhận sự chia sẻ và đóng góp để phát triển sân chơi tốt hơn. Xin chân thành cảm ơn!
          </p>
        </div>

        {/* CỘT 2 */}
        <div className="flex flex-col gap-3">
          <h3 className={`font-bold text-lg ${isHome ? 'text-sky-900' : 'text-slate-800'}`}>Liên Kết Nhanh</h3>
          <ul className={`flex flex-col gap-2 text-sm ${isHome ? 'text-sky-700' : 'text-slate-600'}`}>
            <li><Link to="/" className={`hover:underline ${isHome ? 'hover:text-amber-500' : 'hover:text-blue-600'}`}>Trang chủ</Link></li>
            <li><Link to="/gioi-thieu" className={`hover:underline ${isHome ? 'hover:text-amber-500' : 'hover:text-blue-600'}`}>Giới thiệu</Link></li>
            <li><Link to="/lien-he" className={`hover:underline ${isHome ? 'hover:text-amber-500' : 'hover:text-blue-600'}`}>Liên hệ</Link></li>
            <li><Link to="/chinh-sach" className={`hover:underline ${isHome ? 'hover:text-amber-500' : 'hover:text-blue-600'}`}>Chính sách bảo mật</Link></li>
          </ul>
        </div>

        {/* CỘT 3 */}
        <div className="flex flex-col gap-3">
          <h3 className={`font-bold text-lg ${isHome ? 'text-sky-900' : 'text-slate-800'}`}>Kết Nối Với Chúng Con</h3>
          <ul className={`flex flex-col gap-2 text-sm ${isHome ? 'text-sky-700' : 'text-slate-600'}`}>
            <li>
              Email: <a href="mailto:mrphamee@gmail.com" className={`hover:underline font-medium ${isHome ? 'hover:text-amber-500' : 'hover:text-blue-600'}`}>mrphamee@gmail.com</a>
            </li>
            <li>
              Facebook: <a href="https://www.facebook.com/teo.gon.5" target="_blank" rel="noopener noreferrer" className={`hover:underline font-medium ${isHome ? 'hover:text-amber-500' : 'hover:text-blue-600'}`}>Phạm Duy Ái</a>
            </li>
            <li>
              TikTok: <a href="https://www.tiktok.com/@j.pdasds" target="_blank" rel="noopener noreferrer" className={`hover:underline font-medium ${isHome ? 'hover:text-amber-500' : 'hover:text-blue-600'}`}>Joseph Pham</a>
            </li>
          </ul>
        </div>
      </div>

      {/* DÒNG BẢN QUYỀN */}
      <div className={`max-w-6xl mx-auto px-4 text-center border-t pt-6 ${isHome ? 'border-sky-200' : 'border-slate-200'}`}>
        <p className={`text-xs sm:text-sm font-medium flex items-center justify-center gap-1 flex-wrap ${isHome ? 'text-sky-700' : 'text-slate-500'}`}>
          © 2026 VUI HỌC CÙNG THẦY GIÊSU. Mọi quyền thuộc về vericath.org. 
          <Heart size={14} className="text-red-500 animate-pulse ml-1" />
        </p>
      </div>
    </footer>
  )
}
