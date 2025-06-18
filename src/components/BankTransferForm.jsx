import React from 'react';
import { Building2, Info } from 'lucide-react';
import { paymentConfig } from '../config/countries';

const BankTransferForm = ({ country, selectedBank, onBankChange }) => {
  const countryConfig = paymentConfig.countries[country];
  const banks = countryConfig?.banks || [];

  if (!banks.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Info className="text-yellow-600" size={20} />
          <p className="text-yellow-800">Bank transfer information will be provided after payment initialization.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Building2 className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Bank Transfer</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Bank
        </label>
        <select
          value={selectedBank}
          onChange={(e) => onBankChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose your bank...</option>
          {banks.map(bank => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBank && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Transfer Instructions</h4>
          <p className="text-blue-800 text-sm">
            After clicking "Pay Now", you will receive account details to complete your bank transfer. 
            Your payment will be confirmed once the transfer is processed.
          </p>
        </div>
      )}
    </div>
  );
};

export default BankTransferForm;