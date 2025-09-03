import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CreditCard, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import CurrencySelector from './CurrencySelector';
import PaymentMethodSelector from './PaymentMethodSelector';
import MobileMoneyForm from './MobileMoneyForm';
import BankTransferForm from './BankTransferForm';
import USSDForm from './USSDForm';
import paystackService from '../services/paystackService';
import { validateEmail, validatePhone, validateAmount } from '../utils/validators';

const PaymentInterface = ({ orderData }) => {
  const [formData, setFormData] = useState({
    selectedCurrency: orderData?.currency || 'NGN',
    selectedCountry: 'NG',
    amount: orderData?.amount?.toString() || '',
    customerInfo: {
      email: orderData?.email || '',
      phone: '',
      name: orderData?.customer_name || ''
    },
    paymentMethod: 'card',
    mobileMoneyProvider: '',
    selectedBank: '',
    isProcessing: false,
    errors: {}
  });

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  // Update form data when orderData changes
  useEffect(() => {
    if (orderData) {
      setFormData(prev => ({
        ...prev,
        selectedCurrency: orderData.currency || 'NGN',
        amount: orderData.amount?.toString() || '',
        customerInfo: {
          ...prev.customerInfo,
          email: orderData.email || '',
          name: orderData.customer_name || ''
        }
      }));
    }
  }, [orderData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  const handleCustomerInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value
      },
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.customerInfo.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.customerInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Name validation
    if (!formData.customerInfo.name.trim()) {
      errors.name = 'Name is required';
    }

    // Phone validation
    if (!formData.customerInfo.phone) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.customerInfo.phone, formData.selectedCountry)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Amount validation
    const amountValidation = validateAmount(formData.amount, formData.selectedCurrency);
    if (!amountValidation.valid) {
      errors.amount = amountValidation.error;
    }

    // Payment method specific validation
    if (formData.paymentMethod === 'mobile_money' && !formData.mobileMoneyProvider) {
      errors.mobileMoneyProvider = 'Please select a mobile money provider';
    }

    if (formData.paymentMethod === 'bank_transfer' && !formData.selectedBank) {
      errors.selectedBank = 'Please select your bank';
    }

    if (formData.paymentMethod === 'ussd' && !formData.selectedBank) {
      errors.selectedBank = 'Please select your bank for USSD payment';
    }

    setFormData(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setFormData(prev => ({ ...prev, isProcessing: true }));
    setPaymentStatus('processing');

    try {
      // Store user email in localStorage for transaction history
      localStorage.setItem('userEmail', formData.customerInfo.email);

      const paymentData = {
        email: formData.customerInfo.email,
        amount: parseFloat(formData.amount),
        currency: formData.selectedCurrency,
        payment_method: formData.paymentMethod,
        customer_name: formData.customerInfo.name,
        customer_phone: formData.customerInfo.phone,
        customer_country: formData.selectedCountry,
        mobile_money_provider: formData.mobileMoneyProvider,
        mobile_money_number: formData.paymentMethod === 'mobile_money' ? formData.customerInfo.phone : '',
        bank_code: formData.paymentMethod === 'bank_transfer' || formData.paymentMethod === 'ussd' ? formData.selectedBank : '',
        metadata: {
          selected_bank: formData.selectedBank,
          integration_type: 'react_multi_currency'
        }
      };

      // Call real API to initialize payment
      const result = await paystackService.initializePayment(paymentData);
      if (result.status === 'success' && result.data && result.data.authorization_url) {
        // Check if this is a test mode URL (contains localhost:5176)
        if (result.data.authorization_url.includes('localhost:5176')) {
          // This is test mode - simulate successful payment
          setPaymentStatus('success');
          setPaymentResult({
            reference: result.data.reference,
            status: 'success',
            amount: formData.amount,
            currency: formData.selectedCurrency
          });
        } else {
          // Redirect to Paystack payment page for card payments
          window.location.href = result.data.authorization_url;
        }
      } else if (result.status === 'success') {
        // For other payment methods, show instructions or success
        setPaymentStatus('success');
        setPaymentResult({
          reference: result.data.reference,
          status: 'success',
          amount: formData.amount,
          currency: formData.selectedCurrency
        });
      } else {
        setPaymentStatus('failed');
        setPaymentResult({
          status: 'failed',
          message: result.message || 'Payment initialization failed.'
        });
      }
    } catch (error) {
      setPaymentStatus('failed');
      setPaymentResult({
        status: 'failed',
        message: error.message || 'Payment failed. Please try again.'
      });
    } finally {
      setFormData(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const resetPayment = () => {
    setPaymentStatus(null);
    setPaymentResult(null);
    setFormData(prev => ({
      ...prev,
      amount: '',
      customerInfo: { email: '', phone: '', name: '' },
      errors: {}
    }));
  };

  const getPaymentStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Loader2 className="animate-spin text-blue-500" size={48} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={48} />;
      case 'failed':
        return <XCircle className="text-red-500" size={48} />;
      default:
        return null;
    }
  };

  if (paymentStatus) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="mb-4">
            {getPaymentStatusIcon()}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {paymentStatus === 'processing' && 'Processing Payment...'}
            {paymentStatus === 'success' && 'Payment Successful!'}
            {paymentStatus === 'failed' && 'Payment Failed'}
          </h3>
          
          {paymentResult && (
            <div className="mb-6">
              {paymentStatus === 'success' && (
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Amount: <strong>{formData.selectedCurrency} {formData.amount}</strong>
                  </p>
                  <p className="text-gray-600">
                    Reference: <strong>{paymentResult.reference}</strong>
                  </p>
                </div>
              )}
              
              {paymentStatus === 'failed' && (
                <p className="text-red-600">{paymentResult.message}</p>
              )}
            </div>
          )}
          
          {paymentStatus !== 'processing' && (
            <button
              onClick={resetPayment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Make Another Payment
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Osko Buys Payment</h1>
        <p className="text-gray-600">Complete your purchase securely</p>
      </div>

      {/* Order Summary */}
      {orderData && (
        <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Order Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Order ID: <span className="font-semibold text-gray-900">{orderData.order_id}</span></p>
              <p className="text-gray-600">Amount: <span className="font-semibold text-gray-900">{orderData.currency} {orderData.amount}</span></p>
            </div>
            <div>
              <p className="text-gray-600">Customer: <span className="font-semibold text-gray-900">{orderData.customer_name}</span></p>
              <p className="text-gray-600">Email: <span className="font-semibold text-gray-900">{orderData.email}</span></p>
            </div>
          </div>
          {orderData.order_summary && (
            <p className="text-gray-600 mt-2 text-sm">
              <span className="font-semibold">Items:</span> {orderData.order_summary}
            </p>
          )}
        </div>
      )}

      {/* Currency & Country Selection */}
      <CurrencySelector
        selectedCurrency={formData.selectedCurrency}
        onCurrencyChange={(currency) => handleInputChange('selectedCurrency', currency)}
        selectedCountry={formData.selectedCountry}
        onCountryChange={(country) => handleInputChange('selectedCountry', country)}
      />

      {/* Customer Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.customerInfo.name}
              onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                formData.errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder={orderData?.customer_name ? orderData.customer_name : "Enter your full name"}
            />
            {formData.errors.name && (
              <p className="text-red-600 text-sm mt-1">{formData.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.customerInfo.email}
              onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                formData.errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder={orderData?.email ? orderData.email : "Enter your email address"}
            />
            {formData.errors.email && (
              <p className="text-red-600 text-sm mt-1">{formData.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.customerInfo.phone}
              onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                formData.errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter your phone number"
            />
            {formData.errors.phone && (
              <p className="text-red-600 text-sm mt-1">{formData.errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                formData.errors.amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter amount"
              step="0.01"
              min="0"
            />
            {formData.errors.amount && (
              <p className="text-red-600 text-sm mt-1">{formData.errors.amount}</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <PaymentMethodSelector
        selectedMethod={formData.paymentMethod}
        onMethodChange={(method) => handleInputChange('paymentMethod', method)}
        country={formData.selectedCountry}
        currency={formData.selectedCurrency}
      />

      {/* Payment Method Specific Forms */}
      {formData.paymentMethod === 'mobile_money' && (
        <MobileMoneyForm
          country={formData.selectedCountry}
          phone={formData.customerInfo.phone}
          onPhoneChange={(phone) => handleCustomerInfoChange('phone', phone)}
          provider={formData.mobileMoneyProvider}
          onProviderChange={(provider) => handleInputChange('mobileMoneyProvider', provider)}
        />
      )}

      {formData.paymentMethod === 'bank_transfer' && (
        <BankTransferForm
          country={formData.selectedCountry}
          selectedBank={formData.selectedBank}
          onBankChange={(bank) => handleInputChange('selectedBank', bank)}
        />
      )}

      {formData.paymentMethod === 'ussd' && (
        <USSDForm
          country={formData.selectedCountry}
          selectedBank={formData.selectedBank}
          onBankChange={(bank) => handleInputChange('selectedBank', bank)}
        />
      )}

      {/* Payment Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <button
          onClick={handlePayment}
          disabled={formData.isProcessing}
          className={`
            w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200
            ${formData.isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg'
            }
          `}
        >
          {formData.isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <CreditCard size={20} />
              <span>Pay {formData.selectedCurrency} {formData.amount || '0.00'}</span>
            </div>
          )}
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-3">
          Secure payment powered by Osko Buys
        </p>
      </div>
    </div>
  );
};

export default PaymentInterface;