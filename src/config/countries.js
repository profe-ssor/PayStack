export const paymentConfig = {
  countries: {
    'NG': {
      name: 'Nigeria',
      currency: 'NGN',
      flag: '🇳🇬',
      phoneCode: '+234',
      methods: ['card', 'bank_transfer', 'ussd', 'qr'],
      banks: [
        { code: '044', name: 'Access Bank' },
        { code: '014', name: 'Afribank' },
        { code: '023', name: 'Citibank' },
        { code: '050', name: 'Ecobank' },
        { code: '011', name: 'First Bank' },
        { code: '070', name: 'Fidelity Bank' },
        { code: '058', name: 'Guaranty Trust Bank' },
        { code: '030', name: 'Heritage Bank' },
        { code: '082', name: 'Keystone Bank' },
        { code: '076', name: 'Polaris Bank' },
        { code: '039', name: 'Stanbic IBTC' },
        { code: '232', name: 'Sterling Bank' },
        { code: '032', name: 'Union Bank' },
        { code: '033', name: 'United Bank for Africa' },
        { code: '035', name: 'Wema Bank' },
        { code: '057', name: 'Zenith Bank' }
      ],
      ussdCodes: {
        'access': '*901*Amount*Account#',
        'gtb': '*737*Amount*Account#',
        'firstbank': '*894*Amount*Account#',
        'zenith': '*966*Amount*Account#',
        'uba': '*919*Amount*Account#'
      }
    },
    'GH': {
      name: 'Ghana',
      currency: 'GHS',
      flag: '🇬🇭',
      phoneCode: '+233',
      methods: ['card', 'mobile_money', 'bank_transfer'],
      mobileMoneyProviders: [
        { code: 'mtn', name: 'MTN Mobile Money', prefix: ['024', '025', '053', '054'] },
        { code: 'vodafone', name: 'Vodafone Cash', prefix: ['020', '050'] },
        { code: 'airteltigo', name: 'AirtelTigo Money', prefix: ['027', '057', '026', '056'] }
      ],
      banks: [
        { code: 'absa', name: 'Absa Bank Ghana' },
        { code: 'access', name: 'Access Bank Ghana' },
        { code: 'agricdevelopment', name: 'Agricultural Development Bank' },
        { code: 'ecobank', name: 'Ecobank Ghana' },
        { code: 'fidelity', name: 'Fidelity Bank Ghana' },
        { code: 'gcb', name: 'GCB Bank' },
        { code: 'gtbank', name: 'Guaranty Trust Bank Ghana' },
        { code: 'stanbic', name: 'Stanbic Bank Ghana' }
      ]
    },
    'KE': {
      name: 'Kenya',
      currency: 'KES',
      flag: '🇰🇪',
      phoneCode: '+254',
      methods: ['card', 'mobile_money', 'bank_transfer'],
      mobileMoneyProviders: [
        { code: 'mpesa', name: 'M-Pesa', prefix: ['070', '071', '072', '074', '075', '076', '077', '078'] },
        { code: 'airtel', name: 'Airtel Money', prefix: ['073', '078'] },
        { code: 'tkash', name: 'T-Kash', prefix: ['074'] }
      ],
      banks: [
        { code: 'kcb', name: 'Kenya Commercial Bank' },
        { code: 'equity', name: 'Equity Bank' },
        { code: 'cooperative', name: 'Cooperative Bank' },
        { code: 'absa', name: 'Absa Bank Kenya' },
        { code: 'stanbic', name: 'Stanbic Bank Kenya' },
        { code: 'standard_chartered', name: 'Standard Chartered' }
      ]
    },
    'ZA': {
      name: 'South Africa',
      currency: 'ZAR',
      flag: '🇿🇦',
      phoneCode: '+27',
      methods: ['card', 'eft', 'mobile_money'],
      mobileMoneyProviders: [
        { code: 'mtn', name: 'MTN Mobile Money', prefix: ['083', '084'] }
      ],
      banks: [
        { code: 'absa', name: 'Absa Bank' },
        { code: 'fnb', name: 'First National Bank' },
        { code: 'standard_bank', name: 'Standard Bank' },
        { code: 'nedbank', name: 'Nedbank' },
        { code: 'capitec', name: 'Capitec Bank' },
        { code: 'investec', name: 'Investec Bank' }
      ]
    },
    'US': {
      name: 'United States',
      currency: 'USD',
      flag: '🇺🇸',
      phoneCode: '+1',
      methods: ['card']
    },
    'GB': {
      name: 'United Kingdom',
      currency: 'GBP',
      flag: '🇬🇧',
      phoneCode: '+44',
      methods: ['card']
    },
    'EU': {
      name: 'European Union',
      currency: 'EUR',
      flag: '🇪🇺',
      phoneCode: '+',
      methods: ['card']
    },
    'EG': {
      name: 'Egypt',
      currency: 'EGP',
      flag: '🇪🇬',
      phoneCode: '+20',
      methods: ['card']
    }
  },
  
  currencies: {
    'NGN': { 
      name: 'Nigerian Naira', 
      symbol: '₦', 
      decimals: 2, 
      minAmount: 100, 
      maxAmount: 500000000,
      factor: 100 // kobo
    },
    'USD': { 
      name: 'US Dollar', 
      symbol: '$', 
      decimals: 2, 
      minAmount: 1, 
      maxAmount: 100000,
      factor: 100 // cents
    },
    'GHS': { 
      name: 'Ghanaian Cedi', 
      symbol: '₵', 
      decimals: 2, 
      minAmount: 1, 
      maxAmount: 500000,
      factor: 100 // pesewas
    },
    'ZAR': { 
      name: 'South African Rand', 
      symbol: 'R', 
      decimals: 2, 
      minAmount: 1, 
      maxAmount: 100000,
      factor: 100 // cents
    },
    'KES': { 
      name: 'Kenyan Shilling', 
      symbol: 'KSh', 
      decimals: 2, 
      minAmount: 1, 
      maxAmount: 1000000,
      factor: 100 // cents
    },
    'EUR': { 
      name: 'Euro', 
      symbol: '€', 
      decimals: 2, 
      minAmount: 1, 
      maxAmount: 100000,
      factor: 100 // cents
    },
    'GBP': { 
      name: 'British Pound', 
      symbol: '£', 
      decimals: 2, 
      minAmount: 1, 
      maxAmount: 100000,
      factor: 100 // pence
    },
    'XOF': { 
      name: 'West African CFA Franc', 
      symbol: 'CFA', 
      decimals: 0, 
      minAmount: 100, 
      maxAmount: 10000000,
      factor: 1
    },
    'EGP': { 
      name: 'Egyptian Pound', 
      symbol: 'E£', 
      decimals: 2, 
      minAmount: 1, 
      maxAmount: 100000,
      factor: 100 // piastres
    }
  },

  testCards: {
    successful: '4084084084084408',
    declined: '4084084084084416',
    insufficient_funds: '4084084084084424',
    invalid_pin: '4084084084084432',
    timeout: '4084084084084440'
  },

  validationRules: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: {
      'NG': /^(\+234|234|0)[789][01]\d{8}$/,
      'GH': /^(\+233|233|0)[235][0-9]\d{7}$/,
      'KE': /^(\+254|254|0)[17]\d{8}$/,
      'ZA': /^(\+27|27|0)[67]\d{8}$/
    }
  }
};