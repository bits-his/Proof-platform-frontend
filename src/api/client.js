import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  requestOTP: (phone) => api.post('/auth/request-otp', { phone }),
  verifyOTP: (phone, otp, name) => api.post('/auth/verify-otp', { phone, otp, name }),
  setPin: (phone, pin) => api.post('/auth/set-pin', { phone, pin }),
  login: (phone, pin) => api.post('/auth/login', { phone, pin }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  addBank: (data) => api.post('/auth/banks', data),
};

// Payment API
export const paymentAPI = {
  create: (amount, purpose, customerPhone, customerName) =>
    api.post('/payments/create', { amount, purpose, customerPhone, customerName }),
  confirm: (reference) => api.post(`/payments/${reference}/confirm`),
  getDetails: (reference) => api.get(`/payments/${reference}`),
  getDailySummary: () => api.get('/payments/merchant/daily'),
  getPayments: () => api.get('/payments'),
  getMerchantQR: () => api.get('/payments/merchant/qr'),
};

// Receipt API (public endpoints)
export const receiptAPI = {
  getById: (receiptId) => axios.get(`${API_BASE_URL}/receipts/${receiptId}`),
  search: (receiptId) => axios.get(`${API_BASE_URL}/receipts/search/${receiptId}`),
  universalSearch: (params) => axios.get(`${API_BASE_URL}/receipts/search`, { params }),
  getByPaymentRef: (reference) => axios.get(`${API_BASE_URL}/receipts/payment/${reference}`),
  getWhatsAppLink: (receiptId) => axios.get(`${API_BASE_URL}/receipts/${receiptId}/whatsapp`),
};

export default api;
