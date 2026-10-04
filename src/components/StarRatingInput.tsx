import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxStars?: number;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor / Needs Improvement',
  2: 'Fair / Below Expectation',
  3: 'Good / Average Experience',
  4: 'Very Good / Recommended',
  5: 'Excellent / Highly Recommended',
};

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  maxStars = 5,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : value;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
        {Array.from({ length: maxStars }).map((_, idx) => {
          const starNumber = idx + 1;
          const isSelected = activeRating >= starNumber;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(starNumber)}
              onMouseEnter={() => setHoverRating(starNumber)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-1 -m-1 transition-transform hover:scale-115 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
              aria-label={`${starNumber} star${starNumber > 1 ? 's' : ''}`}
            >
              <Star
                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                  isSelected
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-300 hover:text-amber-300'
                }`}
              />
            </button>
          );
        })}

        {activeRating > 0 && (
          <span className="ml-3 text-xs font-bold text-slate-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            {activeRating} / 5 Stars
          </span>
        )}
      </div>

      <div className="text-xs text-slate-600 font-medium min-h-[18px]">
        {activeRating > 0 ? (
          <span className="text-amber-800 font-semibold">{RATING_LABELS[activeRating]}</span>
        ) : (
          <span className="text-slate-400">Click a star to choose your rating</span>
        )}
      </div>
    </div>
  );
};
