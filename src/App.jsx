import React, { useState, useEffect } from 'react';
import { CreditCard, BarChart3, Settings, History } from 'lucide-react';
import PaymentInterface from './components/PaymentInterface.jsx';
import TransactionHistory from './components/TransactionHistory.jsx';
import PaymentCallback from './components/PaymentCallback.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('payment');
  const [showCallback, setShowCallback] = useState(false);

  // Check if we're on a callback URL
  useEffect(() => {
    const isCallback = window.location.pathname === '/payment/callback' || 
                      window.location.search.includes('reference=') ||
                      window.location.search.includes('trxref=');
    setShowCallback(isCallback);
  }, []);

  const tabs = [
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'history', name: 'History', icon: History }
  ];

  const handleTestRun = (testData, scenario) => {
    console.log('Running test:', scenario.name, testData);
    // Switch to payment tab and pre-fill form
    setActiveTab('payment');
  };

  const handleCallbackBack = () => {
    setShowCallback(false);
    setActiveTab('payment');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Paystack Integration</h1>
                <p className="text-sm text-gray-500">Multi-Currency & Mobile Money</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {tabs.map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                        ${activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <IconComponent size={16} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showCallback ? (
          <PaymentCallback onBack={handleCallbackBack} />
        ) : (
          <>
            {activeTab === 'payment' && <PaymentInterface />}
            {activeTab === 'history' && <TransactionHistory />}
          </>
        )}
      </main>

      {/* Features Grid */}
      {activeTab === 'payment' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supported Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Multi-Currency</h3>
                <p className="text-sm text-gray-600">9 supported currencies including NGN, USD, GHS, KES, ZAR</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold text-lg">📱</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Mobile Money</h3>
                <p className="text-sm text-gray-600">MTN, Vodafone, M-Pesa, AirtelTigo and more</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">🏦</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Bank Transfer</h3>
                <p className="text-sm text-gray-600">Direct bank transfers and EFT payments</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold text-lg">#</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">USSD & QR</h3>
                <p className="text-sm text-gray-600">USSD codes and QR code payments</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;