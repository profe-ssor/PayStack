const API_BASE_URL = 'https://paystack-integration-ldwp.onrender.com/api/payments';

class PaystackService {
  constructor() {
    this.publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_sample_key';
  }

  async initializePayment(paymentData) {
    try {
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Payment data:', paymentData);
      
      const response = await fetch(`${API_BASE_URL}/initialize/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          ...paymentData,
          reference: this.generateReference(),
          callback_url: `${window.location.origin}/payment/callback`,
          metadata: {
            ...paymentData.metadata,
            integration: 'react_multi_currency'
          }
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 200)}`);
      }
      
      const result = await response.json();
      console.log('Response result:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Payment initialization failed');
      }
      
      return result;
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  }

  async verifyPayment(reference) {
    try {
      const response = await fetch(`${API_BASE_URL}/verify/${reference}/`, {
        credentials: 'include',
        mode: 'cors'
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Payment verification failed');
      }
      
      return result;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  async getTransactions(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/transactions/?${queryParams}`, {
        credentials: 'include',
        mode: 'cors'
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch transactions');
      }
      
      return result;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  }

  generateReference() {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `ref_${timestamp}_${randomStr}`;
  }

  async formatAmount(amount, currency) {
    const { currencies } = await import('../config/countries.js');
    const currencyInfo = currencies[currency];
    
    if (!currencyInfo) return amount;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currencyInfo.decimals,
      maximumFractionDigits: currencyInfo.decimals
    }).format(amount);
  }

  async convertToSubunit(amount, currency) {
    const { currencies } = await import('../config/countries.js');
    const currencyInfo = currencies[currency];
    return Math.round(parseFloat(amount) * (currencyInfo?.factor || 100));
  }

  // Simulate payment popup for testing
  simulatePaystackPopup(paymentData, onSuccess, onClose) {
    return new Promise((resolve) => {
      const popup = document.createElement('div');
      popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      popup.innerHTML = `
        <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
          <h3 class="text-xl font-bold mb-4">Paystack Simulation</h3>
          <p class="mb-4">Amount: ${paymentData.currency} ${paymentData.amount}</p>
          <p class="mb-4">Email: ${paymentData.email}</p>
          <div class="flex gap-2">
            <button id="success-btn" class="bg-green-500 text-white px-4 py-2 rounded">
              Simulate Success
            </button>
            <button id="fail-btn" class="bg-red-500 text-white px-4 py-2 rounded">
              Simulate Failure
            </button>
            <button id="close-btn" class="bg-gray-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(popup);

      popup.querySelector('#success-btn').onclick = () => {
        document.body.removeChild(popup);
        onSuccess({ reference: paymentData.reference });
        resolve({ status: 'success' });
      };

      popup.querySelector('#fail-btn').onclick = () => {
        document.body.removeChild(popup);
        onClose();
        resolve({ status: 'failed' });
      };

      popup.querySelector('#close-btn').onclick = () => {
        document.body.removeChild(popup);
        onClose();
        resolve({ status: 'closed' });
      };
    });
  }
}

export default new PaystackService();