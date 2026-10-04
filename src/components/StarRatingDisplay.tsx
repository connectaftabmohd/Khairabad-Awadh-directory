import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingDisplayProps {
  rating: number;
  maxStars?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  totalReviews?: number;
  className?: string;
}

export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
  rating,
  maxStars = 5,
  size = 'sm',
  showNumber = false,
  totalReviews,
  className = '',
}) => {
  const iconSizeClass =
    size === 'xs'
      ? 'w-3 h-3'
      : size === 'sm'
      ? 'w-3.5 h-3.5'
      : size === 'md'
      ? 'w-4 h-4'
      : 'w-5 h-5';

  const textSizeClass =
    size === 'xs'
      ? 'text-[11px]'
      : size === 'sm'
      ? 'text-xs'
      : size === 'md'
      ? 'text-sm'
      : 'text-base';

  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: maxStars }).map((_, idx) => {
          const starNumber = idx + 1;
          const isFilled = roundedRating >= starNumber;
          const isHalf = !isFilled && roundedRating >= starNumber - 0.5;

          return (
            <span key={idx} className="relative inline-block">
              {isFilled ? (
                <Star className={`${iconSizeClass} fill-amber-400 text-amber-400`} />
              ) : isHalf ? (
                <span className="relative">
                  <Star className={`${iconSizeClass} text-slate-300`} />
                  <span className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className={`${iconSizeClass} fill-amber-400 text-amber-400`} />
                  </span>
                </span>
              ) : (
                <Star className={`${iconSizeClass} text-slate-300`} />
              )}
            </span>
          );
        })}
      </div>

      {showNumber && (
        <span className={`font-bold text-slate-900 ${textSizeClass}`}>
          {roundedRating > 0 ? roundedRating.toFixed(1) : 'New'}
        </span>
      )}

      {totalReviews !== undefined && (
        <span className="text-[11px] text-slate-500 font-medium">
          ({totalReviews})
        </span>
      )}
    </div>
  );
};
