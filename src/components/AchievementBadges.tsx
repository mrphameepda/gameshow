import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserProfile } from '@/contexts/AuthContext';

import { Medal, Star, Trophy, ShieldCheck, Lock, X } from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  conditionMet: (profile: UserProfile) => boolean;
}

export const BADGES_DATA: Badge[] = [
  {
    id: "badge_au_nhi",
    name: "Ngành Ấu Chăm Ngoan",
    description: "Đã điểm danh và đọc Lời Chúa đủ 5 lần.",
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    conditionMet: (p) => (p.dailyCheckIn?.checkInCount || 0) >= 5
  },
  {
    id: "badge_bible_knight",
    name: "Hiệp Sĩ Thánh Kinh",
    description: "Đã sưu tập thành công 3 Sticker đầu tiên.",
    icon: ShieldCheck,
    color: "text-sky-500",
    bgColor: "bg-sky-100",
    conditionMet: (p) => Object.keys(p.stickers || {}).length >= 3
  },
  {
    id: "badge_khai_tam",
    name: "Khai Tâm Đệ Nhất",
    description: "Đạt mốc 1000 Xu Vàng trong tài khoản.",
    icon: Trophy,
    color: "text-rose-500",
    bgColor: "bg-rose-100",
    conditionMet: (p) => (p.totalScore || 0) >= 1000
  }
];

export function AchievementBadges() {
  const { currentUser, userProfile } = useAuth();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);


  if (!currentUser || !userProfile) return null;
  const ownedBadges = userProfile.badges || {};

  return (
    <div className="bg-white/95 rounded-[32px] border-2 border-white shadow-[0_12px_24px_rgba(14,165,233,0.15)] mb-10 w-full p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6 justify-center sm:justify-start">
        <Medal className="text-amber-500" size={28} />
        <h2 className="font-display font-black text-2xl text-sky-800">Huy Hiệu Thành Tích</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BADGES_DATA.map((badge) => {
          const isOwned = ownedBadges[badge.id];
          const Icon = badge.icon;

          return (
            <div 
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`rounded-2xl p-4 flex flex-col items-center text-center border-2 transition-all duration-300 cursor-pointer relative group
                ${isOwned ? 'border-sky-300 bg-gradient-to-b from-white to-sky-50 shadow-[0_4px_12px_rgba(14,165,233,0.2)] hover:scale-105' : 'border-slate-200 bg-slate-100 grayscale hover:scale-105'}`}
            >
              {isOwned && (
                <div className="absolute -top-2 -right-2 text-amber-400 animate-pulse z-10">
                  <Star size={24} fill="currentColor" />
                </div>
              )}

              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner relative ${isOwned ? badge.bgColor : 'bg-slate-200'}`}>
                {isOwned ? (
                  <Icon size={32} className={badge.color} />
                ) : (
                  <Lock size={28} className="text-slate-400 opacity-60" />
                )}
              </div>
              
              <h4 className={`font-black text-sm mb-1 ${isOwned ? 'text-sky-900' : 'text-slate-500'}`}>
                {badge.name}
              </h4>
              <p className="text-xs text-slate-500 font-medium line-clamp-2">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>



      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X size={18} />
            </button>
            <div className={`pt-10 pb-6 px-6 flex justify-center items-center relative overflow-hidden ${ownedBadges[selectedBadge.id] ? selectedBadge.bgColor : 'bg-slate-100'}`}>
               <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-150 animate-pulse" />
               {ownedBadges[selectedBadge.id] ? (
                 <selectedBadge.icon size={80} className={`${selectedBadge.color} relative z-10 animate-bounce-subtle drop-shadow-lg`} />
               ) : (
                 <Lock size={80} className="text-slate-400 relative z-10 opacity-50 drop-shadow-md" />
               )}
            </div>
            
            <div className="p-6 text-center">
              <h3 className="font-display font-black text-2xl text-sky-800 mb-2">{selectedBadge.name}</h3>
              <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full mb-4" />
              <p className="text-slate-600 text-sm leading-relaxed font-medium mb-2">
                {selectedBadge.description}
              </p>
              <p className={`text-xs font-bold uppercase tracking-wider mt-4 px-4 py-2 rounded-full inline-block ${ownedBadges[selectedBadge.id] ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {ownedBadges[selectedBadge.id] ? "✅ ĐÃ SỞ HỮU" : "❌ CHƯA ĐẠT"}
              </p>
              
              <button 
                onClick={() => setSelectedBadge(null)}
                className="mt-6 w-full btn-cartoon-3d py-3 text-sm font-bold uppercase tracking-wider"
              >
                ĐÃ HIỂU!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
