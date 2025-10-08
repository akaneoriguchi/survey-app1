import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Star, Trash2, RefreshCw, Download } from 'lucide-react';
import { getResponses, clearAllResponses } from '../utils/storage';
import { exportToCSV } from '../utils/csvExport';
import { logos } from '../data/logos';
import { LogoStats, SurveyResponse } from '../types';
import { StarRating } from './StarRating';

interface AdminPageProps {
  onBack: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [logoStats, setLogoStats] = useState<LogoStats[]>([]);

  const loadData = () => {
    const allResponses = getResponses();
    setResponses(allResponses);

    // Calculate logo statistics
    const stats: LogoStats[] = logos.map(logo => {
      const logoRatings = allResponses.flatMap(response => 
        response.ratings.filter(rating => rating.logoId === logo.id)
      );

      const totalRatings = logoRatings.length;
      const averageRating = totalRatings > 0 
        ? logoRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
        : 0;

      return {
        logoId: logo.id,
        logoName: logo.name,
        averageRating,
        totalRatings
      };
    });

    setLogoStats(stats.sort((a, b) => b.averageRating - a.averageRating));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearData = () => {
    if (window.confirm('すべてのアンケートデータを削除しますか？この操作は取り消せません。')) {
      clearAllResponses();
      loadData();
    }
  };

  const totalResponses = responses.length;
  const totalRatings = responses.reduce((sum, response) => sum + response.ratings.length, 0);
  const averageRatingsPerResponse = totalResponses > 0 ? totalRatings / totalResponses : 0;
  
  const handleExportCSV = () => {
    exportToCSV(responses);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              管理者ダッシュボード
            </h1>
            <p className="text-gray-600">アンケート結果の集計と分析</p>
          </div>
          
          <div className="flex gap-3">
            {totalResponses > 0 && (
              <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CSV出力
              </button>
            )}
            <button
              onClick={loadData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              更新
            </button>
            <button
              onClick={onBack}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              戻る
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">回答数</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{totalResponses}</p>
            <p className="text-sm text-gray-500">総アンケート回答数</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-8 h-8 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">総評価数</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{totalRatings}</p>
            <p className="text-sm text-gray-500">すべてのロゴ評価の合計</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">平均評価数</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {averageRatingsPerResponse.toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">1回答あたりの評価数</p>
          </div>
        </div>

        {/* Logo Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">ロゴ別評価結果</h2>
            {totalResponses > 0 && (
              <button
                onClick={handleClearData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                データを削除
              </button>
            )}
          </div>

          {logoStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">順位</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">ロゴ名</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">平均評価</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">評価数</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">評価</th>
                  </tr>
                </thead>
                <tbody>
                  {logoStats.map((stat, index) => (
                    <tr key={stat.logoId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' :
                          'bg-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-800">{stat.logoName}</td>
                      <td className="py-4 px-4">
                        <span className="text-lg font-bold text-blue-600">
                          {stat.totalRatings > 0 ? stat.averageRating.toFixed(2) : '未評価'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{stat.totalRatings}</td>
                      <td className="py-4 px-4">
                        {stat.totalRatings > 0 && (
                          <StarRating 
                            rating={Math.round(stat.averageRating)} 
                            onRatingChange={() => {}} 
                            size="sm"
                            readonly 
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">まだアンケート回答がありません</p>
              <p className="text-gray-400 text-sm">回答が集まると、ここに統計が表示されます</p>
            </div>
          )}
        </div>

        {/* Recent Responses */}
        {responses.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">最近の回答（詳細）</h2>
            <div className="space-y-4">
              {responses.slice(-5).reverse().map((response, index) => (
                <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">
                      回答 #{responses.length - index}
                    </span>
                    <span className="text-sm text-gray-500">
                      {response.completedAt.toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>性別: {response.demographics.gender} | 年齢: {response.demographics.age}歳</p>
                    <p>{response.ratings.length}個のロゴを評価</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demographics Summary */}
        {responses.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">回答者属性</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">性別分布</h3>
                <div className="space-y-2">
                  {['男性', '女性', 'その他'].map(gender => {
                    const count = responses.filter(r => r.demographics.gender === gender).length;
                    const percentage = totalResponses > 0 ? (count / totalResponses * 100).toFixed(1) : '0';
                    return (
                      <div key={gender} className="flex justify-between items-center">
                        <span className="text-gray-600">{gender}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-12 text-right">
                            {count}人
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Age Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">年齢分布</h3>
                <div className="space-y-2">
                  {[
                    { label: '10代', min: 10, max: 19 },
                    { label: '20代', min: 20, max: 29 },
                    { label: '30代', min: 30, max: 39 },
                    { label: '40代', min: 40, max: 49 },
                    { label: '50代以上', min: 50, max: 120 }
                  ].map(ageGroup => {
                    const count = responses.filter(r => 
                      r.demographics.age >= ageGroup.min && r.demographics.age <= ageGroup.max
                    ).length;
                    const percentage = totalResponses > 0 ? (count / totalResponses * 100).toFixed(1) : '0';
                    return (
                      <div key={ageGroup.label} className="flex justify-between items-center">
                        <span className="text-gray-600">{ageGroup.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-12 text-right">
                            {count}人
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};