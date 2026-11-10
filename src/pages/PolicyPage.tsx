export function PolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-sky-700 text-center mb-10">
          Chính Sách & Bảo Mật
        </h1>
        
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="bg-sky-100 text-sky-600 p-2 rounded-xl">📚</span>
              Chính sách nội dung
            </h2>
            <div className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p>
                Toàn bộ tư liệu, câu đố và hình ảnh hướng đến mục đích giáo dục đức tin, phát triển nhân bản, hoàn toàn phi lợi nhuận và tôn trọng tinh thần Tin Mừng.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">🔒</span>
              Bảo mật thông tin
            </h2>
            <div className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p>
                Cam kết tôn trọng quyền riêng tư của người chơi, an toàn tuyệt đối cho trẻ em. Hệ thống không yêu cầu thông tin nhạy cảm và không chia sẻ dữ liệu với bên thứ ba.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="bg-amber-100 text-amber-600 p-2 rounded-xl">©️</span>
              Bản quyền & Sử dụng
            </h2>
            <div className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p>
                Được vận hành và phát triển dưới sự định hướng của <a href="https://vericath.org" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-bold hover:underline">vericath.org</a>. Mọi hành vi sao chép nhằm mục đích thương mại đều không được phép.
              </p>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  )
}
