import { useState } from 'react';
import { DemographicsForm } from './components/DemographicsForm';
import { SurveyPage } from './components/SurveyPage';
import { ThankYouPage } from './components/ThankYouPage';

type AppState = 'demographics' | 'survey' | 'thankyou';

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('demographics');
  const [demographics, setDemographics] = useState<{ name: string; gender: string; age: number } | null>(null);

  const handleDemographicsComplete = (demo: { name: string; gender: string; age: number }) => {
    setDemographics(demo);
    setCurrentPage('survey');
  };

  const handleSurveyComplete = () => setCurrentPage('thankyou');

  return (
    <div className="relative">
      {currentPage === 'demographics' && (
        <DemographicsForm onComplete={handleDemographicsComplete} />
      )}

      {currentPage === 'survey' && demographics && (
        <SurveyPage demographics={demographics} onComplete={handleSurveyComplete} />
      )}

      {currentPage === 'thankyou' && <ThankYouPage />}
    </div>
  );
}

export default App;