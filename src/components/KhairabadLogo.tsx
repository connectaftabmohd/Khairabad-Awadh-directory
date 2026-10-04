import React from 'react';

interface KhairabadLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const KhairabadLogo: React.FC<KhairabadLogoProps> = ({ size = 'md', className = '' }) => {
  // 16:9 aspect ratio matching the exact board image
  const dimensionClass =
    size === 'sm'
      ? 'w-20 h-[45px]'
      : size === 'lg'
      ? 'w-48 h-[108px]'
      : size === 'xl'
      ? 'w-64 h-[144px]'
      : 'w-[96px] sm:w-[106px] h-[54px] sm:h-[60px]';

  return (
    <div
      className={`relative inline-block ${dimensionClass} shrink-0 select-none ${className}`}
      title="ख़ैराबाद (अवध) / KHAIRABAD (AVADH) / خیر آباد (اودھ)"
      role="img"
      aria-label="Khairabad Railway Station Signboard Logo"
    >
      <svg
        viewBox="0 0 480 270"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Single Yellow Signboard with Thick Rounded Black Border */}
        <rect
          x="7"
          y="7"
          width="466"
          height="256"
          rx="18"
          ry="18"
          fill="#fec200"
          stroke="#000000"
          strokeWidth="14"
        />

        {/* Top Center: Hindi Devanagari 'ख़ैराबाद' */}
        <text
          x="240"
          y="102"
          textAnchor="middle"
          fontSize="72"
          fontWeight="900"
          fontFamily="'Mukta', 'Noto Sans Devanagari', sans-serif"
          fill="#000000"
          letterSpacing="0.4"
        >
          ख़ैराबाद
        </text>

        {/* Top Center: '(अवध)' centered beneath */}
        <text
          x="240"
          y="142"
          textAnchor="middle"
          fontSize="30"
          fontWeight="900"
          fontFamily="'Mukta', 'Noto Sans Devanagari', sans-serif"
          fill="#000000"
        >
          (अवध)
        </text>

        {/* Bottom Left: Heavy Condensed English 'KHAIRABAD' */}
        <text
          x="122"
          y="198"
          textAnchor="middle"
          fontSize="39"
          fontWeight="900"
          fontFamily="'Anton', 'Oswald', 'Impact', sans-serif"
          letterSpacing="1.2"
          fill="#000000"
        >
          KHAIRABAD
        </text>

        {/* Bottom Left: '(AVADH)' centered directly beneath KHAIRABAD */}
        <text
          x="122"
          y="233"
          textAnchor="middle"
          fontSize="28"
          fontWeight="900"
          fontFamily="'Anton', 'Oswald', 'Impact', sans-serif"
          letterSpacing="0.8"
          fill="#000000"
        >
          (AVADH)
        </text>

        {/* Bottom Right: Urdu 'خیر آباد' */}
        <text
          x="364"
          y="198"
          textAnchor="middle"
          fontSize="52"
          fontWeight="bold"
          fontFamily="'Noto Nastaliq Urdu', 'Scheherazade New', 'Amiri', 'Segoe UI', Arial, sans-serif"
          fill="#000000"
        >
          خیر آباد
        </text>

        {/* Bottom Right: '(اودھ)' centered directly beneath */}
        <text
          x="364"
          y="233"
          textAnchor="middle"
          fontSize="27"
          fontWeight="bold"
          fontFamily="'Noto Nastaliq Urdu', 'Scheherazade New', 'Amiri', 'Segoe UI', Arial, sans-serif"
          fill="#000000"
        >
          (اودھ)
        </text>
      </svg>
    </div>
  );
};
