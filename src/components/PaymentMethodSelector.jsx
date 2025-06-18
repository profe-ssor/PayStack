import React from 'react';
import { CreditCard, Smartphone, Building2, QrCode, Hash } from 'lucide-react';
import { paymentConfig } from '../config/countries';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange, country, currency }) => {
  const countryConfig = paymentConfig.countries[country];
  const availableMethods = countryConfig?.methods || ['card'];

  const methodIcons = {
    card: CreditCard,
    mobile_money: Smartphone,
    bank_transfer: Building2,
    ussd: Hash,
    qr: QrCode,
    eft: Building2
  };

  const methodNames = {
    card: 'Card Payment',
    mobile_money: 'Mobile Money',
    bank_transfer: 'Bank Transfer',
    ussd: 'USSD Payment',
    qr: 'QR Code',
    eft: 'Electronic Funds Transfer'
  };

  const methodDescriptions = {
    card: 'Pay with your debit or credit card',
    mobile_money: 'Pay with mobile money (MTN, Vodafone, M-Pesa, etc.)',
    bank_transfer: 'Transfer directly from your bank account',
    ussd: 'Pay using USSD codes on your mobile phone',
    qr: 'Scan QR code to complete payment',
    eft: 'Electronic bank transfer'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableMethods.map(method => {
          const IconComponent = methodIcons[method];
          const isSelected = selectedMethod === method;
          
          return (
            <div
              key={method}
              onClick={() => onMethodChange(method)}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-lg
                  ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                `}>
                  <IconComponent size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`
                    font-medium text-sm
                    ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                  `}>
                    {methodNames[method]}
                  </h4>
                  <p className={`
                    text-xs mt-1
                    ${isSelected ? 'text-blue-700' : 'text-gray-500'}
                  `}>
                    {methodDescriptions[method]}
                  </p>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedMethod && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Selected: <strong>{methodNames[selectedMethod]}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;