import React, { useEffect, useState } from 'react';
import { logos as originalLogos } from '../data/logos';
import { LogoCard } from './LogoCard';

interface SurveyPageProps {
  demographics: { name: string; gender: string; age: number };
  onComplete: () => void;
}

export const SurveyPage: React.FC<SurveyPageProps> = ({ demographics, onComplete }) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logos, setLogos] = useState(originalLogos);

  useEffect(() => {
    const trapId = '15';
    const shuffled = [...originalLogos];

    // トラップロゴを取り除く
    const nonTrap = shuffled.filter(l => String(l.id) !== trapId);
    const trapLogo = shuffled.find(l => String(l.id) === trapId);

    // 残りをシャッフル
    const randomized = nonTrap.sort(() => Math.random() - 0.5);

    // 14番目の次（＝15番目）にトラップを挿入
    if (trapLogo) {
      const insertIndex = Math.min(14, randomized.length); // 0-indexなので14で15番目
      randomized.splice(insertIndex, 0, trapLogo);
    }

    setLogos(randomized);
  }, []);

  const totalLogos = logos.length;
  const ratedCount = Object.values(ratings).filter(v => v > 0).length;

  const handleRatingChange = (logoId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [logoId]: rating }));
  };

  const handleSubmit = async () => {
    const ratedLogos = Object.keys(ratings).filter(id => ratings[id] > 0);
    if (ratedLogos.length !== totalLogos) {
      alert(`すべてのロゴ（${totalLogos}件）を評価してください。`);
      return;
    }

    const url = import.meta.env.VITE_WEBHOOK_URL as string | undefined;
    if (!url) {
      alert('送信先URLが未設定です。');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: demographics.name,
      gender: demographics.gender,
      age: demographics.age,
      ratings: ratedLogos.map((logoId) => ({
        logoId,
        rating: ratings[logoId],
      })),
    };

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      onComplete();
    } catch {
      alert('送信に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ロゴの印象に関するアンケート
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            以下は架空のアパレルブランド「TORIA」のロゴ案です。<br />
            各ロゴを見て、初見の印象を7段階で評価してください。<br />
            （数値が高いほど好印象）<br /><br />
            ロゴは全部で30点あります。すべてのロゴを評価してから送信してください。
          </p>
        </div>

        {/* ロゴカード一覧 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8">
          {logos.map((logo, index) => (
            <LogoCard
              key={logo.id}
              logo={logo}
              rating={ratings[logo.id] || 0}
              onRatingChange={(r) => handleRatingChange(logo.id, r)}
              displayNumber={index + 1}              // 表示番号（1〜）
              trapTarget={String(logo.id) === '15'}  // トラップ設問
            />
          ))}
        </div>

        {/* 送信ボタン */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || ratedCount !== totalLogos}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '送信中...' : 'アンケートを送信'}
          </button>
        </div>
      </div>
    </div>
  );
};