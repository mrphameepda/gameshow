import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ref, update } from 'firebase/database';
import { rtdb } from '@/config/firebase';
import { BADGES_DATA, type Badge } from './AchievementBadges';


export function GlobalBadgeListener() {
  const { currentUser, userProfile } = useAuth();
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    if (!currentUser || !userProfile) return;

    // We don't want to check while they are viewing someone else's room, 
    // but userProfile is always the logged in user's profile in AuthContext.
    const ownedBadges = userProfile.badges || {};
    const updates: Record<string, boolean> = {};
    let newlyUnlocked: Badge | null = null;

    for (const badge of BADGES_DATA) {
      if (!ownedBadges[badge.id] && badge.conditionMet(userProfile)) {
        updates[`users/${currentUser.uid}/badges/${badge.id}`] = true;
        newlyUnlocked = badge;
        break; // Only show one modal at a time
      }
    }

    if (newlyUnlocked) {
      update(ref(rtdb), updates)
        .then(() => setUnlockedBadge(newlyUnlocked))
        .catch(err => console.error("Lỗi cấp huy hiệu:", err));
    }
  }, [currentUser, userProfile]);

  if (!unlockedBadge) return null;

  const Icon = unlockedBadge.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500 border-4 border-amber-300">
        <div className="bg-gradient-to-b from-amber-100 to-white pt-10 pb-6 px-6 flex flex-col justify-center items-center relative overflow-hidden">
           {/* Sunray Aura Animations */}
           <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full scale-150 animate-pulse" />
           
           <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl ${unlockedBadge.bgColor} relative z-10 animate-cartoon-bounce-1`}>
             <Icon size={64} className={`${unlockedBadge.color} drop-shadow-md`} />
           </div>
        </div>
        
        <div className="p-6 text-center">
          <h2 className="font-display font-black text-2xl md:text-3xl text-rose-500 mb-2 drop-shadow-sm uppercase">
            🎉 CHÚC MỪNG CON ĐÃ ĐẠT DANH HIỆU MỚI!
          </h2>
          <div className="w-16 h-1.5 bg-sky-400 mx-auto rounded-full mb-4" />
          
          <h3 className="font-display font-black text-xl text-sky-800 mb-2">{unlockedBadge.name}</h3>
          
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            {unlockedBadge.description}
          </p>
          
          <button 
            onClick={() => setUnlockedBadge(null)}
            className="mt-8 w-full btn-cartoon-3d py-4 text-sm sm:text-base bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-[0_6px_0_#b45309]"
          >
            TẠ ƠN CHÚA! ĐỒNG Ý
          </button>
        </div>
      </div>
    </div>
  );
}
