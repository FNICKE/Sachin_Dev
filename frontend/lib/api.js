const DEFAULT_API_URL = 'https://sachin-dev-59j2.onrender.com/api';

export const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : DEFAULT_API_URL;
export const BASE_URL = API_URL.replace('/api', '');

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return headers;
};

const readResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return res.json();
  }

  const text = await res.text();
  return {
    success: false,
    message: text || `Request failed with status ${res.status}`,
  };
};

const checkResponse = async (res) => {
  const data = await readResponse(res);
  if (!res.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.response = { data, status: res.status };
    throw error;
  }
  return { data };
};

const api = {
  get: async (url, config = {}) => {
    const headers = getAuthHeaders();
    if (config.headers) Object.assign(headers, config.headers);

    const res = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers,
    });
    return checkResponse(res);
  },

  post: async (url, body = {}, config = {}) => {
    const headers = getAuthHeaders();
    if (config.headers) Object.assign(headers, config.headers);

    // If body is FormData, don't stringify it and don't set JSON content-type
    const isFormData = body instanceof FormData;
    if (isFormData) {
       delete headers['Content-Type'];
    }

    const res = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    return checkResponse(res);
  },

  put: async (url, body = {}, config = {}) => {
    const headers = getAuthHeaders();
    if (config.headers) Object.assign(headers, config.headers);

    const isFormData = body instanceof FormData;
    if (isFormData) {
       delete headers['Content-Type'];
    }

    const res = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    return checkResponse(res);
  },

  delete: async (url, config = {}) => {
    const headers = getAuthHeaders();
    if (config.headers) Object.assign(headers, config.headers);

    const res = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers,
    });
    return checkResponse(res);
  },
};

export default api;
