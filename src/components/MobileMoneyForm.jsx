import React, { useState, useEffect } from 'react';
import { Smartphone, AlertCircle } from 'lucide-react';
import { paymentConfig } from '../config/countries';
import { validateMobileMoneyNumber, formatPhoneNumber } from '../utils/validators';

const MobileMoneyForm = ({ country, phone, onPhoneChange, provider, onProviderChange }) => {
  const [phoneError, setPhoneError] = useState('');
  const countryConfig = paymentConfig.countries[country];
  const providers = countryConfig?.mobileMoneyProviders || [];

  useEffect(() => {
    if (phone && provider) {
      const validation = validateMobileMoneyNumber(phone, provider, country);
      setPhoneError(validation.valid ? '' : validation.error);
    }
  }, [phone, provider, country]);

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value, country);
    onPhoneChange(formatted);
  };

  const getProviderInstructions = (providerCode) => {
    const instructions = {
      'mtn': 'You will receive a prompt on your MTN mobile money registered phone to authorize this payment',
      'vodafone': 'Check your phone for Vodafone Cash payment authorization',
      'airteltigo': 'You will receive an AirtelTigo Money payment request',
      'mpesa': 'Check your phone for M-Pesa STK push notification',
      'airtel': 'You will receive an Airtel Money payment request',
      'tkash': 'Check your phone for T-Kash payment authorization'
    };
    return instructions[providerCode] || 'Follow the prompts on your mobile device to complete payment';
  };

  if (!providers.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="text-yellow-600" size={20} />
          <p className="text-yellow-800">Mobile money is not available for this country.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Smartphone className="text-green-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Mobile Money Payment</h3>
      </div>

      <div className="space-y-4">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Provider
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {providers.map(p => (
              <div
                key={p.code}
                onClick={() => onProviderChange(p.code)}
                className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${provider === p.code 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{p.name}</span>
                  {provider === p.code && (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Prefix: {p.prefix.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Phone Number Input */}
        {provider && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Money Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder={`${countryConfig.phoneCode} 20 123 4567`}
                className={`
                  w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent
                  ${phoneError 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                  }
                `}
              />
              {phoneError && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <AlertCircle className="text-red-500" size={16} />
                </div>
              )}
            </div>
            {phoneError && (
              <p className="text-red-600 text-sm mt-1">{phoneError}</p>
            )}
          </div>
        )}

        {/* Instructions */}
        {provider && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Payment Instructions</h4>
            <p className="text-blue-800 text-sm">
              {getProviderInstructions(provider)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMoneyForm;