import React from 'react';
import { Hash, Smartphone } from 'lucide-react';
import { paymentConfig } from '../config/countries';

const USSDForm = ({ country, selectedBank, onBankChange }) => {
  const countryConfig = paymentConfig.countries[country];
  const ussdCodes = countryConfig?.ussdCodes || {};
  const bankCodes = Object.keys(ussdCodes);

  const bankNames = {
    'access': 'Access Bank',
    'gtb': 'GTBank',
    'firstbank': 'First Bank',
    'zenith': 'Zenith Bank',
    'uba': 'UBA'
  };

  if (!bankCodes.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Hash className="text-yellow-600" size={20} />
          <p className="text-yellow-800">USSD payment is not available for this country.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Hash className="text-purple-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">USSD Payment</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Bank
        </label>
        <select
          value={selectedBank}
          onChange={(e) => onBankChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Choose your bank...</option>
          {bankCodes.map(code => (
            <option key={code} value={code}>
              {bankNames[code] || code.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {selectedBank && ussdCodes[selectedBank] && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Smartphone className="text-purple-600" size={16} />
              <h4 className="font-medium text-purple-900">USSD Code</h4>
            </div>
            <div className="bg-white p-3 rounded border font-mono text-lg text-center">
              {ussdCodes[selectedBank]}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Dial the USSD code shown above on your registered phone</li>
              <li>2. Replace "Amount" with the payment amount</li>
              <li>3. Replace "Account" with the provided account number</li>
              <li>4. Follow the prompts to complete your payment</li>
              <li>5. You will receive a confirmation SMS upon successful payment</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default USSDForm;