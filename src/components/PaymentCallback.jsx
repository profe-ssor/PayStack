import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import paystackService from '../services/paystackService.js';

const PaymentCallback = ({ onBack }) => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying payment...');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get reference from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference') || urlParams.get('trxref');
        
        if (!reference) {
          setStatus('failed');
          setMessage('No payment reference found');
          return;
        }

        // Verify payment with backend
        const result = await paystackService.verifyPayment(reference);
        
        if (result.status === 'success' && result.data.status === 'success') {
          setStatus('success');
          setMessage('Payment successful! Your transaction has been completed.');
          setPaymentData(result.data);
        } else {
          setStatus('failed');
          setMessage('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Failed to verify payment. Please check your transaction status.');
      }
    };

    verifyPayment();
  }, []);

  const handleBack = () => {
    // Remove the callback path from URL and go back to main app
    window.history.replaceState({}, document.title, '/');
    if (onBack) onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              
              {paymentData && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Transaction Details:</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Reference:</span> {paymentData.reference}</p>
                    <p><span className="font-medium">Amount:</span> {paymentData.currency} {paymentData.amount}</p>
                    <p><span className="font-medium">Status:</span> {paymentData.status}</p>
                    <p><span className="font-medium">Channel:</span> {paymentData.channel || 'N/A'}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
            </>
          )}

          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback; 