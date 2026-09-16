import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    hero: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <div
        className={`${sizeClasses[size]} rounded-2xl overflow-hidden bg-white shadow-xs border border-rose-100 p-0.5 shrink-0 relative group`}
      >
        <img
          src="/logo.jpg"
          alt="Kethelin Beauty Nails Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback to stylized SVG if image ever fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Typography text branding */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className="text-2xl sm:text-[26px] leading-tight font-normal text-[#C57E6B] font-['Great_Vibes',cursive] tracking-wide"
              style={{
                textShadow: '0 1px 1px rgba(197, 126, 107, 0.15)',
              }}
            >
              Kethelin
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.28em] text-[#A66E5E] -mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
            BEAUTY NAILS
          </span>
        </div>
      )}
    </div>
  );
};
