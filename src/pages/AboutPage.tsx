export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-sky-100 w-full">
      <div className="pt-32 pb-16 px-4 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-display font-black text-sky-800 text-center mb-10 drop-shadow-sm">
          Hành Trình Lý Sống Động
        </h1>
        
        {/* Main Card */}
        <div className="bg-white/95 rounded-[32px] border-2 border-white shadow-[0_12px_24px_rgba(14,165,233,0.12)] p-8 md:p-10 w-full">
          
          {/* Section 1: Tầm Nhìn & Sứ Mạng */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-black text-sky-700 mb-6 text-center drop-shadow-sm">
              🎯 Tầm Nhìn Bao La & Sứ Mạng Yêu Thương
            </h2>
            <div className="text-slate-600 leading-relaxed text-lg text-center font-medium px-0 md:px-8">
              Chào mừng các con đến với không gian Vui Học Cùng Thầy Giêsu! Đây là một sân chơi Giáo lý trực quan, an lành và tràn ngập niềm vui dành riêng cho Thiếu nhi, Huynh trưởng và Giới trẻ Công giáo. Bằng thế giới hoạt hình 3D tươi sáng, chúng mình biến việc học Kinh Thánh và Giáo lý trở thành một cuộc phiêu lưu nhẹ nhàng, đầy ắp tiếng cười và đong đầy tình yêu mến!
            </div>
          </section>

          <hr className="border-t-2 border-slate-100 mb-12 w-3/4 mx-auto" />

          {/* Section 2: Giá Trị Cốt Lõi */}
          <section>
            <h2 className="text-2xl md:text-3xl font-display font-black text-sky-700 mb-8 text-center drop-shadow-sm">
              🌟 4 Viên Ngọc Cốt Lõi Của Con
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ngọc Yêu Thương */}
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-rose-50 border-2 border-rose-100 hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm text-3xl">
                  ❤️
                </div>
                <div>
                  <h3 className="font-black text-xl text-rose-600 mb-1">Yêu Thương</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Lan tỏa tình thương của Chúa đến mọi người xung quanh.
                  </p>
                </div>
              </div>

              {/* Ngọc Học Hỏi */}
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-sky-50 border-2 border-sky-100 hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm text-3xl">
                  📖
                </div>
                <div>
                  <h3 className="font-black text-xl text-sky-600 mb-1">Học Hỏi</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Chăm ngoan khám phá kho tàng Kinh Thánh mỗi ngày.
                  </p>
                </div>
              </div>

              {/* Ngọc Kết Nối */}
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-amber-50 border-2 border-amber-100 hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm text-3xl">
                  🤝
                </div>
                <div>
                  <h3 className="font-black text-xl text-amber-600 mb-1">Kết Nối</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Gắn kết bạn bè, cùng nhau thăng tiến trong Sa mạc tình yêu.
                  </p>
                </div>
              </div>

              {/* Ngọc Đức Tin */}
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-100 hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm text-3xl">
                  ✝️
                </div>
                <div>
                  <h3 className="font-black text-xl text-emerald-600 mb-1">Đức Tin</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Nuôi dưỡng ngọn lửa đức tin nhỏ bé ngày một lớn khôn.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
}
