const DEFAULT_API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : 'https://sachin-dev.onrender.com/api';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
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

const api = {
  get: async (url, config = {}) => {
    const headers = getAuthHeaders();
    if (config.headers) Object.assign(headers, config.headers);

    const res = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers,
    });
    const data = await readResponse(res);
    if (!res.ok) throw { response: { data, status: res.status } };
    return { data };
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
    const data = await readResponse(res);
    if (!res.ok) throw { response: { data, status: res.status } };
    return { data };
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
    const data = await readResponse(res);
    if (!res.ok) throw { response: { data, status: res.status } };
    return { data };
  },

  delete: async (url, config = {}) => {
    const headers = getAuthHeaders();
    if (config.headers) Object.assign(headers, config.headers);

    const res = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers,
    });
    const data = await readResponse(res);
    if (!res.ok) throw { response: { data, status: res.status } };
    return { data };
  },
};

export default api;
