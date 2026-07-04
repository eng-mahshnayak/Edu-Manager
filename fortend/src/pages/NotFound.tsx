import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[12rem] md:text-[16rem] font-bold text-indigo-100 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="text-8xl mb-4 animate-bounce">🔍</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track!
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          {/* <button
            onClick={() => navigate('/dashboard')}
            className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold text-gray-800">Dashboard</div>
            <div className="text-xs text-gray-500">Go to Dashboard</div>
          </button> */}

          {/* <button
            onClick={() => navigate('/sale/invoice')}
            className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">📄</div>
            <div className="font-semibold text-gray-800">Invoices</div>
            <div className="text-xs text-gray-500">View Sale Invoices</div>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">⬅️</div>
            <div className="font-semibold text-gray-800">Go Back</div>
            <div className="text-xs text-gray-500">Previous Page</div>
          </button> */}
        </div>

        {/* Search or Navigation Help */}
        {/* <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 max-w-lg mx-auto">
          <p className="text-sm text-gray-600 mb-4">
            Popular Pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/sale/invoice')}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
            >
              Sale Invoice
            </button>
            <button
              onClick={() => navigate('/purchase/invoice')}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
            >
              Purchase
            </button>
            <button
              onClick={() => navigate('/parties/get')}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
            >
              Parties
            </button>
            <button
              onClick={() => navigate('/inventory/stock')}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
            >
              Stock
            </button>
            <button
              onClick={() => navigate('/reports/get')}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
            >
              Reports
            </button>
          </div>
        </div> */}

        {/* Home Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all hover:-translate-y-1 shadow-lg inline-flex items-center gap-2"
        >
          <span>🏠</span>
          Take Me Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;