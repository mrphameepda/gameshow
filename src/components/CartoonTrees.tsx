
export const CartoonTreeRound = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 130" className={`overflow-visible ${className}`}>
    <defs>
      <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#854d0e" />
        <stop offset="50%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="foliageGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="40%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    {/* Thân cây */}
    <path d="M45,70 Q43,100 38,125 L62,125 Q57,100 55,70 Z" fill="url(#trunkGrad)" />
    {/* Tán cây 3D dạng bong bóng bông gòn */}
    <circle cx="35" cy="55" r="26" fill="url(#foliageGrad)" />
    <circle cx="65" cy="55" r="26" fill="url(#foliageGrad)" />
    <circle cx="50" cy="35" r="30" fill="url(#foliageGrad)" />
    <circle cx="50" cy="50" r="22" fill="#4ade80" opacity="0.6" />
  </svg>
);

export const CartoonBush = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 80 45" className={`overflow-visible ${className}`}>
    <path d="M10,40 Q2,20 25,15 Q40,0 55,15 Q78,20 70,40 Z" fill="#16a34a" />
    <circle cx="28" cy="22" r="14" fill="#4ade80" />
    <circle cx="50" cy="24" r="13" fill="#22c55e" />
    {/* Bông hoa nhỏ */}
    <circle cx="38" cy="18" r="3" fill="#fef08a" />
    <circle cx="20" cy="30" r="2" fill="#fff" />
    <circle cx="60" cy="28" r="2.5" fill="#f97316" />
  </svg>
);

export const CartoonPineTree = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 130" className={`overflow-visible ${className}`}>
    <defs>
      <linearGradient id="trunkGradPine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#854d0e" />
        <stop offset="50%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="pineGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
    </defs>
    {/* Thân cây */}
    <path d="M45,100 L45,130 L55,130 L55,100 Z" fill="url(#trunkGradPine)" />
    {/* Tán cây 3D dạng hình nón */}
    <path d="M10,100 Q50,110 90,100 L50,30 Z" fill="url(#pineGrad)" />
    <path d="M20,70 Q50,80 80,70 L50,10 Z" fill="url(#pineGrad)" opacity="0.9" />
    <path d="M30,40 Q50,50 70,40 L50,-10 Z" fill="url(#pineGrad)" opacity="0.8" />
  </svg>
);

export default function MeadowDecorations() {
  return (
    <>
      {/* Lớp cây trồng sâu vào mặt cỏ (bottom: 16px - 24px) */}
      <div className="absolute inset-x-0 bottom-4 z-12 pointer-events-none opacity-80">
        <CartoonPineTree className="absolute bottom-1 left-[5%] w-12 sm:w-16 drop-shadow-md" />
        <CartoonTreeRound className="absolute bottom-2 left-[20%] w-10 sm:w-14 drop-shadow-md transform scale-90" />
        <CartoonPineTree className="absolute bottom-3 left-[45%] w-14 sm:w-20 drop-shadow-md" />
        <CartoonTreeRound className="absolute bottom-1 left-[70%] w-12 sm:w-16 drop-shadow-md transform scale-75" />
      </div>

      <div className="absolute inset-x-0 bottom-5 z-12 pointer-events-none">
        {/* Cây lớn xum xuê góc trái (sau lưng đàn cừu) */}
        <CartoonTreeRound className="absolute bottom-0 left-[-2%] w-24 sm:w-32 drop-shadow-xl" />
        
        {/* Cụm cây nhỡ ở 2/3 màn hình */}
        <CartoonTreeRound className="absolute bottom-1 left-[60%] w-16 sm:w-24 drop-shadow-lg" />
        <CartoonPineTree className="absolute bottom-0 left-[66%] w-20 sm:w-28 drop-shadow-lg" />
        
        {/* Các bụi hoa cỏ dại rung rinh (trên mặt cỏ) */}
        <CartoonBush className="absolute bottom-[-10px] left-[15%] w-12 sm:w-16 drop-shadow-md animate-pulse duration-3000" />
        <CartoonBush className="absolute bottom-[-8px] left-[35%] w-10 sm:w-14 drop-shadow-md animate-pulse duration-4000" />
        <CartoonBush className="absolute bottom-[-10px] left-[85%] w-14 sm:w-20 drop-shadow-md animate-pulse duration-5000" />
      </div>
    </>
  );
}
