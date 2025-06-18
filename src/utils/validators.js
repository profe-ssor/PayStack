import { paymentConfig } from '../config/countries.js';

export const validateEmail = (email) => {
  const emailRegex = paymentConfig.validationRules.email;
  return emailRegex.test(email);
};

export const validatePhone = (phone, country) => {
  const phoneRegex = paymentConfig.validationRules.phone[country];
  if (!phoneRegex) return true; // Skip validation for countries without rules
  return phoneRegex.test(phone);
};

export const validateAmount = (amount, currency) => {
  const currencyInfo = paymentConfig.currencies[currency];
  if (!currencyInfo) return { valid: false, error: 'Invalid currency' };
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return { valid: false, error: 'Invalid amount format' };
  
  if (numAmount < currencyInfo.minAmount) {
    return { 
      valid: false, 
      error: `Minimum amount is ${currencyInfo.symbol}${currencyInfo.minAmount}` 
    };
  }
  
  if (numAmount > currencyInfo.maxAmount) {
    return { 
      valid: false, 
      error: `Maximum amount is ${currencyInfo.symbol}${currencyInfo.maxAmount}` 
    };
  }
  
  return { valid: true };
};

export const validateMobileMoneyNumber = (phone, provider, country) => {
  const countryConfig = paymentConfig.countries[country];
  if (!countryConfig?.mobileMoneyProviders) return { valid: false, error: 'Mobile money not supported' };
  
  const providerInfo = countryConfig.mobileMoneyProviders.find(p => p.code === provider);
  if (!providerInfo) return { valid: false, error: 'Invalid provider' };
  
  // Remove country code and spaces
  const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(countryConfig.phoneCode.replace('+', ''), '');
  
  // Check if phone starts with valid prefix for provider
  const hasValidPrefix = providerInfo.prefix.some(prefix => cleanPhone.startsWith(prefix));
  
  if (!hasValidPrefix) {
    return { 
      valid: false, 
      error: `Invalid ${providerInfo.name} number. Must start with ${providerInfo.prefix.join(', ')}` 
    };
  }
  
  return { valid: true };
};

export const formatPhoneNumber = (phone, country) => {
  const countryConfig = paymentConfig.countries[country];
  if (!countryConfig) return phone;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if not present
  const countryCode = countryConfig.phoneCode.replace('+', '');
  if (!digits.startsWith(countryCode)) {
    return `${countryConfig.phoneCode}${digits}`;
  }
  
  return `+${digits}`;
};

export const formatCurrency = (amount, currency) => {
  const currencyInfo = paymentConfig.currencies[currency];
  if (!currencyInfo) return amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currencyInfo.decimals,
    maximumFractionDigits: currencyInfo.decimals
  }).format(amount);
};

export const getAvailablePaymentMethods = (country, currency) => {
  const countryConfig = paymentConfig.countries[country];
  if (!countryConfig) return ['card'];
  
  return countryConfig.methods || ['card'];
};