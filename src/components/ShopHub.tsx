import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Sparkles, CheckCircle2, ArrowRightLeft } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  type: 'sticker' | 'room' | 'badge';
}

const SHOP_ITEMS: ShopItem[] = [
  // Stickers
  { id: "st_joseph", name: "Thánh Giuse", price: 200, imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=joseph&backgroundColor=fcd34d", description: "Thánh Giuse", type: 'sticker' },
  { id: "st_mary", name: "Đức Mẹ Ban Ơn", price: 200, imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=mary&backgroundColor=93c5fd", description: "Đức Mẹ Maria", type: 'sticker' },
  { id: "noahs_ark", name: "Thuyền Nô-ê", price: 200, imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=ark&backgroundColor=86efac", description: "Ông Nô-ê", type: 'sticker' },
  { id: "st_peter", name: "Thánh Phêrô", price: 200, imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=peter&backgroundColor=fca5a5", description: "Thánh Phêrô", type: 'sticker' },
  
  // Room
  { id: "room_table", name: "Bàn Học Ngoan", price: 500, imageUrl: "/assets/room/room_table.png", description: "Bàn học bằng gỗ ấm áp cho bé.", type: 'room' },
  { id: "room_bookshelf", name: "Tủ Sách Lời Chúa", price: 600, imageUrl: "/assets/room/room_bookshelf.png", description: "Tủ đựng Kinh Thánh và Nến sáng.", type: 'room' },
  { id: "room_carpet", name: "Thảm Mây Trời", price: 400, imageUrl: "/assets/room/room_carpet.png", description: "Thảm bồng bềnh như mây trên Thiên Đàng.", type: 'room' },

  // Badges
  { id: "badge_cross", name: "Cúp Thánh Giá", price: 1000, imageUrl: "/assets/badges/badge_cross.png", description: "Danh hiệu cao quý dành cho thiếu nhi ngoan.", type: 'badge' },
  { id: "badge_bible", name: "Huy Chương Lời Chúa", price: 1500, imageUrl: "/assets/badges/badge_bible.png", description: "Danh hiệu người chăm chỉ học Kinh Thánh.", type: 'badge' },
  { id: "badge_chalice", name: "Cúp Chén Thánh", price: 2000, imageUrl: "/assets/badges/badge_chalice.png", description: "Phần thưởng của Tình Yêu Bí Tích.", type: 'badge' },
];

export function ShopHub() {
  const { currentUser, userProfile, buyItem, convertScoreToCoins } = useAuth();
  const [activeTab, setActiveTab] = useState<'STICKER' | 'ROOM' | 'BADGE' | 'EXCHANGE'>('STICKER');
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [exchangeAmount, setExchangeAmount] = useState<number>(100);
  const [exchangeMsg, setExchangeMsg] = useState('');

  if (!currentUser || !userProfile) return null;

  const currentCoins = userProfile.coins || 0;
  const currentScore = userProfile.totalScore || 0;
  const ownedStickers = userProfile.stickers || {};
  const ownedInventory = userProfile.inventory || {};


  const handleBuy = async (item: ShopItem) => {
    if (currentCoins < item.price || buyingId) return;
    setBuyingId(item.id);
    try {
      const isSticker = item.type === 'sticker';
      await buyItem(item.id, item.price, isSticker);
      // Mua badge có thể tái sử dụng hàm buyItem với logic tương tự
    } catch (e) {
      console.error(e);
    } finally {
      setBuyingId(null);
    }
  };

  const handleExchange = async () => {
    if (exchangeAmount > currentScore || exchangeAmount <= 0) {
      setExchangeMsg('❌ Điểm không đủ hoặc không hợp lệ');
      return;
    }
    setExchangeMsg('');
    const success = await convertScoreToCoins(exchangeAmount);
    if (success) {
      setExchangeMsg('✅ Đổi thành công!');
    } else {
      setExchangeMsg('❌ Có lỗi xảy ra');
    }
  };

  const itemsToShow = SHOP_ITEMS.filter(i => i.type === activeTab.toLowerCase());

  return (
    <div className="bg-white/95 rounded-[32px] border-2 border-white shadow-[0_12px_24px_rgba(14,165,233,0.15)] mb-10 w-full overflow-hidden flex flex-col">
      <div className="bg-gradient-to-b from-sky-50 to-white px-6 pt-6 pb-4 border-b border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={28} />
          <h2 className="font-display font-black text-2xl text-sky-800">Cửa Hàng Thiên Đàng</h2>
        </div>
        
        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-full shadow-inner gap-1">
          {['STICKER', 'ROOM', 'BADGE', 'EXCHANGE'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as 'STICKER' | 'ROOM' | 'BADGE' | 'EXCHANGE')}
              className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${activeTab === tab ? 'bg-white text-sky-600 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab === 'STICKER' ? '🖼️ Sticker' : tab === 'ROOM' ? '🪑 Nội Thất' : tab === 'BADGE' ? '🏆 Danh Hiệu' : '💱 Đổi Xu'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 relative min-h-[300px]">
        {/* Số dư xu vàng & Điểm */}
        <div className="absolute top-4 right-6 flex flex-col gap-2 z-10 items-end">
          <div className="bg-amber-100 border-2 border-amber-300 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <Coins size={18} className="text-amber-500" />
            <span className="font-black text-amber-600">{currentCoins.toLocaleString()} Xu</span>
          </div>
          <div className="bg-blue-100 border-2 border-blue-300 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm text-xs font-bold text-blue-700">
            Điểm: {currentScore.toLocaleString()}
          </div>
        </div>

        {activeTab === 'EXCHANGE' ? (
          <div className="mt-16 max-w-md mx-auto bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <h3 className="font-black text-lg text-slate-700 mb-4">Trạm Quy Đổi Điểm Thưởng</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn có thể đổi Điểm Thành Tích (dùng đua Top) sang Xu Vàng để mua sắm. Lưu ý: Điểm sẽ bị trừ!</p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl font-bold flex flex-col w-28">
                <span>Điểm</span>
                <span className="text-xl">{exchangeAmount}</span>
              </div>
              <ArrowRightLeft className="text-slate-400" />
              <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl font-bold flex flex-col w-28">
                <span>Xu Vàng</span>
                <span className="text-xl">{exchangeAmount}</span>
              </div>
            </div>

            <input 
              type="range" min="0" max={currentScore} step="50"
              value={exchangeAmount} onChange={e => setExchangeAmount(Number(e.target.value))}
              className="w-full mb-6 accent-blue-500"
            />
            
            <button 
              onClick={handleExchange}
              disabled={exchangeAmount <= 0 || exchangeAmount > currentScore}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-black rounded-xl shadow-md disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Xác Nhận Đổi
            </button>
            {exchangeMsg && <p className="mt-4 text-sm font-bold">{exchangeMsg}</p>}
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {itemsToShow.map((item) => {
              const isOwned = item.type === 'sticker' ? ownedStickers[item.id] : ownedInventory[item.id];
              const canAfford = currentCoins >= item.price;
              const isBuying = buyingId === item.id;

              return (
                <div key={item.id} className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex flex-col items-center hover:border-sky-200 hover:shadow-lg transition-all group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-3 bg-slate-50 relative group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain drop-shadow-md" />
                    {isOwned && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase shadow-sm flex items-center gap-1 -rotate-12">
                          <CheckCircle2 size={12} /> Đã có
                        </div>
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-sky-900 text-sm text-center mb-1 line-clamp-1">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 text-center mb-3 line-clamp-2 h-7">{item.description}</p>
                  
                  {!isOwned ? (
                    <button 
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford || isBuying}
                      className={`w-full py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all
                        ${canAfford 
                          ? 'bg-amber-400 hover:bg-amber-500 text-white shadow-[0_4px_0_#d97706] active:translate-y-1 active:shadow-none cursor-pointer' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                      {isBuying ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>MUA {item.price} <Coins size={14} /></>
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
        )}
      </div>
    </div>
  );
}
