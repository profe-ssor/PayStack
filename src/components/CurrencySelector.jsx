import React from 'react';
import { paymentConfig } from '../config/countries';

const CurrencySelector = ({ selectedCurrency, onCurrencyChange, selectedCountry, onCountryChange }) => {
  const currencies = Object.keys(paymentConfig.currencies);
  const countries = Object.keys(paymentConfig.countries);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Country & Currency</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {countries.map(code => {
              const country = paymentConfig.countries[code];
              return (
                <option key={code} value={code}>
                  {country.flag} {country.name}
                </option>
              );
            })}
          </select>
        </div>
        
        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {currencies.map(code => {
              const currency = paymentConfig.currencies[code];
              return (
                <option key={code} value={code}>
                  {currency.symbol} {currency.name} ({code})
                </option>
              );
            })}
          </select>
        </div>
      </div>
      
      {/* Currency Info */}
      {selectedCurrency && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="text-sm text-blue-800">
            <p><strong>Min Amount:</strong> {paymentConfig.currencies[selectedCurrency].symbol}{paymentConfig.currencies[selectedCurrency].minAmount}</p>
            <p><strong>Max Amount:</strong> {paymentConfig.currencies[selectedCurrency].symbol}{paymentConfig.currencies[selectedCurrency].maxAmount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;