import { useEffect, useState } from 'react';
import { DemographicsForm } from './components/DemographicsForm';
import { SurveyPage } from './components/SurveyPage';
import { ThankYouPage } from './components/ThankYouPage';
import { AdminPage } from './components/AdminPage';

type AppState = 'demographics' | 'survey' | 'thankyou' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('demographics');
  const [demographics, setDemographics] = useState<{ name: string; gender: string; age: number } | null>(null);

  const handleDemographicsComplete = (demo: { name: string; gender: string; age: number }) => {
    setDemographics(demo);
    setCurrentPage('survey');
  };

  const handleSurveyComplete = () => setCurrentPage('thankyou');

  const handleBackToSurvey = () => setCurrentPage('demographics');

  const askAdminPassword = () => {
    const password = prompt('管理者パスワードを入力してください:');
    if (password === 'admin123') {
      setCurrentPage('admin');
    } else if (password !== null) {
      alert('パスワードが間違っています。');
      setCurrentPage('demographics');
    }
  };

  // ✅ 管理者ページのアクセス条件：URLが #admin のときのみ
  useEffect(() => {
    if (window.location.hash === '#admin') {
      askAdminPassword();
    }
  }, []);

  return (
    <div className="relative">
      {/* ページ内容 */}
      {currentPage === 'demographics' && (
        <DemographicsForm onComplete={handleDemographicsComplete} />
      )}

      {currentPage === 'survey' && demographics && (
        <SurveyPage demographics={demographics} onComplete={handleSurveyComplete} />
      )}

      {currentPage === 'thankyou' && <ThankYouPage />}

      {currentPage === 'admin' && <AdminPage onBack={handleBackToSurvey} />}
    </div>
  );
}

export default App;