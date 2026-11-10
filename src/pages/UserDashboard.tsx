import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home, Gamepad2, ShoppingBag, Award, LogOut, Coins, Flame } from 'lucide-react';
import { LeaderboardSidebar } from '@/components/LeaderboardSidebar';

export default function UserDashboard() {
  const { userProfile, currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading || !currentUser || !userProfile) return null;

  return (
    <div className="min-h-screen bg-[#F1F7FD] text-slate-800 p-4 md:p-6 lg:p-8 flex justify-center">
      <div className="w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= CỘT 1: SIDEBAR TRÁI (col-span-2) ================= */}
        <aside className="hidden lg:flex lg:col-span-2 flex-col justify-between bg-white rounded-[28px] p-6 shadow-[0_10px_25px_rgba(2,132,199,0.05)] border border-sky-100/60 sticky top-6 min-h-[calc(100vh-48px)]">
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-white font-black text-xl shadow-md">
                ✝
              </div>
              <div>
                <h2 className="font-black text-sky-900 text-sm leading-tight">VUI HỌC</h2>
                <p className="text-[10px] text-amber-500 font-extrabold uppercase">Thầy Giêsu</p>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="flex flex-col gap-2">
              <button onClick={() => navigate('/')} className="flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-all">
                <Home size={18}/> Trang Chủ
              </button>
              <button className="flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm bg-sky-50 text-sky-600 shadow-sm">
                <Gamepad2 size={18}/> Phòng Cá Nhân
              </button>
              <button onClick={() => navigate('/#stickers')} className="flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-all">
                <ShoppingBag size={18}/> Cửa Hàng Quà
              </button>
              <button className="flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-all">
                <Award size={18}/> Sổ Sưu Tập
              </button>
            </nav>
          </div>

          {/* User Profile Mini & Logout */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={userProfile?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=avatar"} alt="avatar" className="w-9 h-9 rounded-full bg-sky-100" />
              <div className="leading-tight">
                <p className="font-extrabold text-xs text-slate-800 line-clamp-1">{userProfile?.displayName || 'Thiếu Nhi'}</p>
                <p className="text-[10px] text-amber-500 font-bold">{userProfile?.totalScore || 0} Xu</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="text-slate-400 hover:text-rose-500 transition-colors p-1.5" title="Đăng xuất">
              <LogOut size={16}/>
            </button>
          </div>
        </aside>

        {/* ================= CỘT 2: NỘI DUNG CHÍNH (col-span-7) ================= */}
        <main className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          {/* Header Search & Stats Banner */}
          <div className="bg-white rounded-[28px] p-8 border border-sky-100/60 shadow-[0_10px_25px_rgba(2,132,199,0.05)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="z-10 max-w-md">
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-full mb-3">
                CẤP ĐỘ THIẾU NHI
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-sky-950 leading-tight">
                Chào mừng con, <span className="text-sky-600">{userProfile?.displayName || 'Hoàng Huy'}</span>! 👋
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
                Mỗi câu đố là một bước đi cùng Thầy Giêsu trên hành trình khám phá Lời Chúa.
              </p>
              <button onClick={() => navigate('/#games')} className="mt-5 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 rounded-full px-6 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                TIẾP TỤC CHƠI GAME →
              </button>
            </div>
            {/* Mascot 3D */}
            <div className="w-40 md:w-52 shrink-0">
              <img src="/assets/jesus-kids.png" alt="Mascot" className="w-full h-auto drop-shadow-md" onError={(e) => { (e.target as any).style.display = 'none'; }} />
            </div>
          </div>

          {/* Lời Chúa Hôm Nay (Card Phong Cách Mới) */}
          <div className="bg-white rounded-[28px] p-6 border border-sky-100/60 shadow-[0_10px_25px_rgba(2,132,199,0.05)] flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-2xl shadow-inner">
              📖
            </div>
            <div className="flex-1">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-400">Lời Chúa Trong Ngày</h4>
              <p className="font-extrabold text-sky-900 text-sm md:text-base italic mt-1">
                "Thầy là đường, là sự thật và là sự sống." (Ga 14,6)
              </p>
            </div>
            <div className="shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full">
              ✅ Đã Nhận Quà
            </div>
          </div>

          {/* Khu Vực Căn Phòng 2D */}
          <div className="bg-white rounded-[28px] p-6 border border-sky-100/60 shadow-[0_10px_25px_rgba(2,132,199,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg text-sky-950">🛋️ Căn Phòng Của Con</h3>
              <button className="text-xs font-bold text-sky-600 hover:underline">Sắp xếp vật phẩm</button>
            </div>
            <div className="w-full aspect-[16/9] bg-gradient-to-b from-sky-50 via-amber-50/30 to-amber-100/50 rounded-2xl border-2 border-dashed border-sky-200 flex items-center justify-center relative overflow-hidden">
              <p className="text-slate-400 text-sm font-semibold">Khu vực đặt Kệ sách, Bàn học & Thánh tích của bé</p>
            </div>
          </div>
        </main>

        {/* ================= CỘT 3: TIẾN ĐỘ & BẢNG VÀNG (col-span-3) ================= */}
        <aside className="col-span-1 lg:col-span-3 flex flex-col gap-6 sticky top-6">
          {/* Thẻ Chỉ Số Nhanh */}
          <div className="bg-white rounded-[28px] p-6 border border-sky-100/60 shadow-[0_10px_25px_rgba(2,132,199,0.05)] flex items-center justify-around">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-amber-500 font-black text-lg">
                <Coins size={18}/> {userProfile?.totalScore || 0}
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Xu Vàng</span>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-rose-500 font-black text-lg">
                <Flame size={18}/> 3 Ngày
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Siêng Năng</span>
            </div>
          </div>

          {/* Bảng Vàng Rút Gọn (Leaderboard) */}
          <div className="bg-white rounded-[28px] p-6 border border-sky-100/60 shadow-[0_10px_25px_rgba(2,132,199,0.05)]">
            <h3 className="font-black text-base text-sky-950 mb-4 flex items-center gap-2">
              🏆 Bảng Vàng Danh Dự
            </h3>
            <div className="-mx-6">
               <LeaderboardSidebar />
            </div>
          </div>

          {/* Huy Hiệu Gần Nhất */}
          <div className="bg-white rounded-[28px] p-6 border border-sky-100/60 shadow-[0_10px_25px_rgba(2,132,199,0.05)]">
            <h3 className="font-black text-base text-sky-950 mb-3 flex items-center gap-2">
              🎖️ Huy Hiệu Đạt Được
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-sm">🌿</div>
                <span className="text-[10px] font-extrabold text-slate-600 line-clamp-1">Chăm Ngoan</span>
              </div>
              <div className="flex flex-col items-center gap-1 opacity-40 grayscale">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl">⚔️</div>
                <span className="text-[10px] font-extrabold text-slate-400 line-clamp-1">Hiệp Sĩ</span>
              </div>
              <div className="flex flex-col items-center gap-1 opacity-40 grayscale">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl">🔥</div>
                <span className="text-[10px] font-extrabold text-slate-400 line-clamp-1">Đuốc Sáng</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
