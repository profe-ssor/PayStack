import React, { useState } from 'react';
import { PlayCircle, CreditCard, Smartphone, Building2, Hash, RefreshCw } from 'lucide-react';
import { paymentConfig } from '../config/countries';

const TestingDashboard = ({ onRunTest }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [testAmount, setTestAmount] = useState('1000');

  const testScenarios = [
    {
      id: 'successful_card',
      name: 'Successful Card Payment',
      icon: CreditCard,
      color: 'green',
      description: 'Test successful card payment flow',
      cardNumber: paymentConfig.testCards.successful
    },
    {
      id: 'declined_card',
      name: 'Declined Card Payment',
      icon: CreditCard,
      color: 'red',
      description: 'Test declined card payment scenario',
      cardNumber: paymentConfig.testCards.declined
    },
    {
      id: 'insufficient_funds',
      name: 'Insufficient Funds',
      icon: CreditCard,
      color: 'yellow',
      description: 'Test insufficient funds scenario',
      cardNumber: paymentConfig.testCards.insufficient_funds
    },
    {
      id: 'mobile_money_success',
      name: 'Mobile Money Payment',
      icon: Smartphone,
      color: 'blue',
      description: 'Test mobile money payment flow',
      available: ['GH', 'KE', 'ZA']
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building2,
      color: 'purple',
      description: 'Test bank transfer payment',
      available: ['NG', 'GH', 'KE', 'ZA']
    },
    {
      id: 'ussd_payment',
      name: 'USSD Payment',
      icon: Hash,
      color: 'indigo',
      description: 'Test USSD payment flow',
      available: ['NG']
    }
  ];

  const runQuickTest = async (scenario) => {
    const testData = {
      email: 'test@example.com',
      amount: testAmount,
      currency: selectedCurrency,
      country: selectedCountry,
      payment_method: scenario.id.includes('card') ? 'card' : 
                     scenario.id.includes('mobile_money') ? 'mobile_money' :
                     scenario.id.includes('bank') ? 'bank_transfer' : 'ussd',
      customer_name: 'Test Customer',
      customer_phone: getTestPhoneNumber(selectedCountry),
      metadata: {
        test_scenario: scenario.id,
        test_card: scenario.cardNumber
      }
    };

    if (onRunTest) {
      onRunTest(testData, scenario);
    }
  };

  const getTestPhoneNumber = (country) => {
    const testNumbers = {
      'NG': '+2348012345678',
      'GH': '+233201234567',
      'KE': '+254701234567',
      'ZA': '+27821234567'
    };
    return testNumbers[country] || '+1234567890';
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
      red: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100',
      blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100'
    };
    return colors[color] || colors.blue;
  };

  const isScenarioAvailable = (scenario) => {
    if (!scenario.available) return true;
    return scenario.available.includes(selectedCountry);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <PlayCircle className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">Testing Dashboard</h3>
      </div>

      {/* Test Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(paymentConfig.countries).map(code => (
              <option key={code} value={code}>
                {paymentConfig.countries[code].flag} {paymentConfig.countries[code].name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(paymentConfig.currencies).map(code => (
              <option key={code} value={code}>
                {paymentConfig.currencies[code].symbol} {code}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1000"
          />
        </div>
      </div>

      {/* Test Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testScenarios.map(scenario => {
          const IconComponent = scenario.icon;
          const isAvailable = isScenarioAvailable(scenario);
          
          return (
            <div
              key={scenario.id}
              className={`
                relative border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer
                ${isAvailable 
                  ? getColorClasses(scenario.color)
                  : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              onClick={() => isAvailable && runQuickTest(scenario)}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-lg
                  ${isAvailable ? `bg-${scenario.color}-100` : 'bg-gray-100'}
                `}>
                  <IconComponent size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1">
                    {scenario.name}
                  </h4>
                  <p className="text-xs">
                    {scenario.description}
                  </p>
                  {scenario.cardNumber && (
                    <p className="text-xs font-mono mt-1">
                      Card: {scenario.cardNumber}
                    </p>
                  )}
                </div>
              </div>
              
              {!isAvailable && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">Not available for {paymentConfig.countries[selectedCountry].name}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
          
          <button
            onClick={() => {
              setTestAmount('100');
              setSelectedCurrency('USD');
              setSelectedCountry('US');
            }}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm transition-colors"
          >
            USD Test
          </button>
          
          <button
            onClick={() => {
              setTestAmount('500');
              setSelectedCurrency('GHS');
              setSelectedCountry('GH');
            }}
            className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-sm transition-colors"
          >
            Mobile Money Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestingDashboard;