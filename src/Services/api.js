// Dev resolves this through the Vite proxy in vite.config.js. Static hosts like
// GitHub Pages have no proxy, so the build supplies an absolute URL instead
// (see .env.production).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('accessToken');
  if (token) {
    headers.Authorization = `${localStorage.getItem('tokenType') || 'Bearer'} ${token}`;
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (networkErr) {
    console.error('Network error:', networkErr);
    throw new Error('مشكلة في الاتصال بالسيرفر');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // response wasn't JSON
  }

  if (!response.ok) {
    const msg = data?.error?.message || `Server error ${response.status}`;
    const err = new Error(msg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const authApi = {
  requestOtp: (phone) =>
    apiClient('/public/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone, otpCode) =>
    apiClient('/public/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otpCode }),
    }),

  refresh: (refreshToken) =>
    apiClient('/public/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
};

export default apiClient;