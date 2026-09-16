import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-10 sm:h-11 w-auto max-w-[120px]',
    md: 'h-13 sm:h-15 w-auto max-w-[160px]',
    lg: 'h-16 sm:h-20 w-auto max-w-[200px]',
    hero: 'h-24 sm:h-32 w-auto max-w-[280px]',
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Transparent Logo Image without background */}
      <img
        src="/logo.png"
        alt="Kethelin Beauty Nails"
        referrerPolicy="no-referrer"
        className={`${sizeClasses[size]} object-contain select-none shrink-0 transition-transform duration-200`}
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* Typography text branding (only if explicitly requested) */}
      {showText && (
        <div className="flex flex-col justify-center ml-3">
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
