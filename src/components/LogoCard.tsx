import React from 'react';
import { Logo } from '../types';
import { StarRating } from './StarRating';

interface LogoCardProps {
  logo: Logo;
  rating: number;
  onRatingChange: (rating: number) => void;
  displayNumber: number;   // ← 追加（表示用番号）
  trapTarget?: boolean;    // ← 追加（トラップ設問対象）
}

export const LogoCard: React.FC<LogoCardProps> = ({ 
  logo, 
  rating, 
  onRatingChange,
  displayNumber,
  trapTarget = false
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 relative transition hover:shadow-lg">
      {/* 表示番号 */}
      <span className="absolute top-2 left-2 text-gray-600 text-sm font-semibold">
        {displayNumber}
      </span>

      <div className="flex flex-col items-center space-y-3">
        <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <img 
            src={logo.imageUrl} 
            alt={logo.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* トラップ設問用メッセージ（目立たせない） */}
        {trapTarget && (
          <p className="text-xs text-gray-700 text-center leading-tight">
            ※このロゴは必ず「5」を選んでください
          </p>
        )}

        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-600">このロゴを評価してください</p>

          {/* モバイル用（~sm） */}
          <div className="w-full sm:hidden">
            <StarRating rating={rating} onRatingChange={onRatingChange} size="sm" />
          </div>

          {/* タブレット以上（sm~） */}
          <div className="hidden sm:block w-full">
            <StarRating rating={rating} onRatingChange={onRatingChange} size="md" />
          </div>

          <p className="text-xs text-gray-500">
            {rating > 0 ? `${rating}/7` : '未評価'}
          </p>
        </div>
      </div>
    </div>
  );
};