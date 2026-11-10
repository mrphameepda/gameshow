import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ref, update, increment } from 'firebase/database';
import { rtdb } from '@/config/firebase';
import { Sparkles, Gift } from 'lucide-react';

const BIBLE_VERSES = [
  "Thầy là đường, là sự thật và là sự sống. (Ga 14,6)",
  "Thiên Chúa là tình yêu. (1 Ga 4,8)",
  "Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em. (Ga 15,12)",
  "Phúc thay ai xót thương người, vì họ sẽ được Thiên Chúa xót thương. (Mt 5,7)",
  "Lạy Chúa, xin thêm đức tin cho chúng con. (Lc 17,5)",
  "Hãy ký thác đường đời cho Chúa, tin tưởng vào Người, Người sẽ ra tay. (Tv 37,5)"
];

export function DailyDevotionQuest() {
  const { currentUser, userProfile } = useAuth();
  const [isClaimed, setIsClaimed] = useState(false);
  const [verse, setVerse] = useState('');
  const [isOpening, setIsOpening] = useState(false);

  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  useEffect(() => {
    if (userProfile?.dailyCheckIn?.lastCheckInDate === currentDate) {
      setIsClaimed(true);
      setVerse(BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)]);
    }
  }, [userProfile, currentDate]);

  const handleClaim = async () => {
    if (!currentUser || isClaimed || isOpening) return;
    
    setIsOpening(true);
    
    try {
      const currentCount = userProfile?.dailyCheckIn?.checkInCount || 0;
      const updates = {
        [`users/${currentUser.uid}/dailyCheckIn/lastCheckInDate`]: currentDate,
        [`users/${currentUser.uid}/dailyCheckIn/checkInCount`]: currentCount + 1,
        [`users/${currentUser.uid}/totalScore`]: increment(50)
      };
      
      await update(ref(rtdb), updates);
      
      setVerse(BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)]);
      setIsClaimed(true);
      
    } catch (error) {
      console.error("Lỗi khi nhận thưởng:", error);
    } finally {
      setIsOpening(false);
    }
  };

  if (!currentUser) return null; // Chỉ hiển thị khi đã đăng nhập

  return (
    <div className="bg-white/95 rounded-[32px] border-2 border-sky-100 shadow-[0_12px_24px_rgba(14,165,233,0.15)] p-6 mb-10 w-full relative overflow-hidden group">
      {/* Nền trang trí */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/40 rounded-full blur-3xl -z-10 group-hover:bg-amber-300/40 transition-colors" />
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Hộp quà icon */}
        <div className="shrink-0 relative">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-700 ${isClaimed ? 'bg-amber-100' : 'bg-gradient-to-tr from-rose-400 to-pink-500 animate-bounce-subtle cursor-pointer hover:scale-110 active:scale-95'}`}
               onClick={!isClaimed ? handleClaim : undefined}
          >
            {isClaimed ? (
              <Sparkles size={40} className="text-amber-500" />
            ) : (
              <Gift size={40} className="text-white" />
            )}
          </div>
          
          {/* Hiệu ứng bay xu vàng khi bấm nhận */}
          {isOpening && (
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[80%] flex flex-col items-center animate-out fade-out slide-out-to-top-8 duration-1000">
                <span className="text-amber-500 font-black text-2xl drop-shadow-md">+50</span>
             </div>
          )}
        </div>

        {/* Nội dung */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-display font-black text-2xl text-sky-800 mb-1">
            Lời Chúa Mỗi Ngày
          </h3>
          
          {isClaimed ? (
            <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 mt-2 animate-in fade-in zoom-in duration-500">
              <p className="text-sky-900 font-bold italic text-sm md:text-base leading-relaxed">
                "{verse}"
              </p>
              <p className="text-emerald-500 font-bold text-[11px] mt-3 uppercase tracking-wider">
                ✅ Đã nhận xu vàng - Hẹn gặp con ngày mai!
              </p>
            </div>
          ) : (
            <p className="text-slate-600 text-sm mt-1">
              Mở hộp quà để nhận Lời Chúa hôm nay và được tặng thêm <span className="font-bold text-amber-500">50 Xu Vàng</span> nhé!
            </p>
          )}
        </div>

        {/* Button Nhận thưởng (nếu chưa nhận) */}
        {!isClaimed && (
          <div className="shrink-0">
            <button 
              onClick={handleClaim}
              disabled={isOpening}
              className="btn-cartoon-3d px-6 py-3 text-sm flex items-center gap-2"
            >
              MỞ QUÀ NGAY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
