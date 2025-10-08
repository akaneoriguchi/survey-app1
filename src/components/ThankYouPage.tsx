import { CheckCircle } from 'lucide-react';


export const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ご協力ありがとう<br/>
              ございました！
            </h1>
            <p className="text-gray-600">
              アンケートの回答が完了しました。<br />
              クラウドワークス上にて、<br/>完了報告をお願いいたします。<br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};