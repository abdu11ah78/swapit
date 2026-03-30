// components/common/pronavbar/PromoBar.tsx
"use client"

export const PromoBar = () => {
    const promos = [
        "FREE SHIPPING ON ORDERS OVER $50",
        "NEW ARRIVALS JUST DROPPED",
        "EXCLUSIVE MEMBER DEALS",
        "24/7 CUSTOMER SUPPORT",
    ];

    const repeatedPromos = [...promos, ...promos, ...promos, ...promos, ...promos];

    return (
        <div className="absolute top-0 left-0 right-0 z-[60] overflow-hidden bg-black border-b border-white/10">
            <div
                className="flex gap-12 whitespace-nowrap"
                style={{ animation: 'slide-left 40s linear infinite' }}
            >
                {repeatedPromos.map((promo, i) => (
                    <span
                        key={i}
                        className="flex-shrink-0 text-white py-2 text-xs font-bold tracking-[0.2em] min-w-fit px-4"
                    >
                        {promo}
                    </span>
                ))}
            </div>

            <style jsx global>{`
        @keyframes slide-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-20%);
          }
        }
      `}</style>
        </div>
    )
}