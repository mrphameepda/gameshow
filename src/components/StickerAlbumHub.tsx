import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ref, runTransaction } from 'firebase/database';
import { rtdb } from '@/config/firebase';
import { Lock, Coins, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface Sticker {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

const STICKERS_DATA: Sticker[] = [
  {
    id: "st_joseph",
    name: "Thánh Giuse",
    price: 200,
    imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=joseph&backgroundColor=fcd34d",
    description: "Thánh Giuse là cha nuôi của Chúa Giêsu, Ngài luôn âm thầm, hiền lành và lao động chăm chỉ để chăm sóc cho Thánh Gia."
  },
  {
    id: "st_mary",
    name: "Đức Mẹ Ban Ơn",
    price: 200,
    imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=mary&backgroundColor=93c5fd",
    description: "Đức Mẹ Maria là Mẹ của Chúa Giêsu và cũng là Mẹ của tất cả chúng ta. Mẹ luôn yêu thương và lắng nghe lời cầu nguyện của các em thiếu nhi."
  },
  {
    id: "noahs_ark",
    name: "Thuyền Nô-ê",
    price: 200,
    imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=ark&backgroundColor=86efac",
    description: "Ông Nô-ê đã vâng lời Chúa đóng một chiếc tàu lớn để cứu gia đình và các loài vật khỏi trận đại hồng thủy an toàn."
  },
  {
    id: "st_peter",
    name: "Thánh Phêrô",
    price: 200,
    imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=peter&backgroundColor=fca5a5",
    description: "Thánh Phêrô là vị Giáo hoàng đầu tiên của Giáo hội, là người chài lưới được Chúa Giêsu trao chìa khóa Nước Trời."
  }
];

export function StickerAlbumHub() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'SHOP' | 'ALBUM'>('SHOP');
  const [buyingStickerId, setBuyingStickerId] = useState<string | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);

  if (!currentUser || !userProfile) return null;

  const currentCoins = userProfile.totalScore || 0;
  const ownedStickers = userProfile.stickers || {};

  const handleBuySticker = async (sticker: Sticker) => {
    if (currentCoins < sticker.price || ownedStickers[sticker.id] || buyingStickerId) return;

    setBuyingStickerId(sticker.id);
    
    try {
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      await runTransaction(userRef, (user) => {
        if (user) {
          const score = user.totalScore || 0;
          const userStickers = user.stickers || {};
          
          if (score >= sticker.price && !userStickers[sticker.id]) {
            user.totalScore = score - sticker.price;
            if (!user.stickers) user.stickers = {};
            user.stickers[sticker.id] = true;
          }
        }
        return user;
      });
    } catch (error) {
      console.error("Lỗi khi mua sticker:", error);
    } finally {
      setBuyingStickerId(null);
    }
  };

  return (
    <div className="bg-white/95 rounded-[32px] border-2 border-white shadow-[0_12px_24px_rgba(14,165,233,0.15)] mb-10 w-full overflow-hidden flex flex-col">
      {/* Header & Tabs */}
      <div className="bg-gradient-to-b from-sky-50 to-white px-6 pt-6 pb-4 border-b border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={28} />
          <h2 className="font-display font-black text-2xl text-sky-800">Sưu Tập Sticker</h2>
        </div>
        
        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1.5 rounded-full shadow-inner w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('SHOP')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === 'SHOP' ? 'bg-white text-sky-600 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            🛒 Cửa Hàng
          </button>
          <button 
            onClick={() => setActiveTab('ALBUM')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === 'ALBUM' ? 'bg-white text-rose-500 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            📖 Sổ Của Con
          </button>
        </div>
      </div>

      <div className="p-6 relative min-h-[300px]">
        {/* Số dư xu vàng */}
        <div className="absolute top-4 right-6 bg-amber-100 border-2 border-amber-300 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm z-10">
          <Coins size={18} className="text-amber-500" />
          <span className="font-black text-amber-600">{currentCoins.toLocaleString()}</span>
        </div>

        {/* TAB 1: CỬA HÀNG ĐỔI QUÀ */}
        {activeTab === 'SHOP' && (
          <div className="mt-10">
            <p className="text-center text-slate-500 text-sm mb-6 font-medium">Dùng Xu Vàng để đổi lấy những Sticker thật đẹp nhé!</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STICKERS_DATA.map((sticker) => {
                const isOwned = ownedStickers[sticker.id];
                const canAfford = currentCoins >= sticker.price;
                const isBuying = buyingStickerId === sticker.id;

                return (
                  <div key={sticker.id} className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex flex-col items-center hover:border-sky-200 hover:shadow-lg transition-all group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-3 bg-slate-50 relative group-hover:scale-105 transition-transform duration-300">
                      <img src={sticker.imageUrl} alt={sticker.name} className="w-full h-full object-cover p-2" />
                      {isOwned && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase shadow-sm flex items-center gap-1 -rotate-12">
                            <CheckCircle2 size={12} /> Đã có
                          </div>
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-sky-900 text-sm text-center mb-3 line-clamp-1">{sticker.name}</h4>
                    
                    {!isOwned ? (
                      <button 
                        onClick={() => handleBuySticker(sticker)}
                        disabled={!canAfford || isBuying}
                        className={`w-full py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all
                          ${canAfford 
                            ? 'bg-amber-400 hover:bg-amber-500 text-white shadow-[0_4px_0_#d97706] active:translate-y-1 active:shadow-none cursor-pointer' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                      >
                        {isBuying ? (
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>ĐỔI {sticker.price} <Coins size={14} /></>
                        )}
                      </button>
                    ) : (
                      <div className="w-full py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center bg-emerald-100 text-emerald-600">
                        SỞ HỮU
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SỔ SƯU TẬP CỦA CON */}
        {activeTab === 'ALBUM' && (
          <div className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {STICKERS_DATA.map((sticker) => {
                const isOwned = ownedStickers[sticker.id];

                return (
                  <div 
                    key={sticker.id} 
                    onClick={() => isOwned && setSelectedSticker(sticker)}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-4 transition-all duration-300
                      ${isOwned 
                        ? 'border-sky-200 cursor-pointer hover:scale-105 hover:shadow-xl hover:border-sky-400 shadow-sm bg-white' 
                        : 'border-slate-200 bg-slate-100'}`}
                  >
                    <img 
                      src={sticker.imageUrl} 
                      alt={sticker.name} 
                      className={`w-full h-full object-cover p-3 transition-all duration-500 ${!isOwned ? 'grayscale opacity-30 scale-95' : 'scale-100 drop-shadow-md'}`} 
                    />
                    
                    {!isOwned && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <Lock size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Chưa mở khóa</span>
                      </div>
                    )}

                    {isOwned && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-900/80 to-transparent pt-6 pb-2 px-2 text-center translate-y-full group-hover:translate-y-0 transition-transform">
                        <span className="text-white text-[11px] font-bold truncate block">{sticker.name}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {Object.keys(ownedStickers).length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium">Con chưa có Sticker nào. Hãy sang Cửa Hàng để đổi nhé!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT STICKER (Khi ấn vào sticker trong Album) */}
      {selectedSticker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedSticker(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="bg-sky-50 pt-10 pb-6 px-6 flex justify-center items-center relative overflow-hidden">
               <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-150 animate-pulse" />
               <img src={selectedSticker.imageUrl} alt={selectedSticker.name} className="w-32 h-32 object-contain drop-shadow-xl relative z-10 animate-float-slow" />
            </div>
            
            <div className="p-6 text-center">
              <h3 className="font-display font-black text-2xl text-sky-800 mb-2">{selectedSticker.name}</h3>
              <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full mb-4" />
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {selectedSticker.description}
              </p>
              
              <button 
                onClick={() => setSelectedSticker(null)}
                className="mt-6 w-full btn-cartoon-3d py-3 text-sm"
              >
                TUYỆT VỜI!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
