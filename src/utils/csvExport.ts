import { SurveyResponse } from '../types';
import { logos } from '../data/logos';

export const exportToCSV = (responses: SurveyResponse[]): void => {
  if (responses.length === 0) {
    alert('エクスポートするデータがありません。');
    return;
  }

  // Create CSV headers
  const headers = [
    '回答ID',
    '回答日時',
    '性別',
    '年齢',
    ...logos.map(logo => `${logo.name}_評価`),
    '評価数'
  ];

  // Create CSV rows
  const rows = responses.map(response => {
    const row = [
      response.id,
      response.completedAt.toLocaleString('ja-JP'),
      response.demographics.gender,
      response.demographics.age.toString()
    ];

    // Add ratings for each logo
    logos.forEach(logo => {
      const rating = response.ratings.find(r => r.logoId === logo.id);
      row.push(rating ? rating.rating.toString() : '未評価');
    });

    // Add total ratings count
    row.push(response.ratings.length.toString());

    return row;
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Add BOM for proper Japanese character display in Excel
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `logo-survey-results-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};