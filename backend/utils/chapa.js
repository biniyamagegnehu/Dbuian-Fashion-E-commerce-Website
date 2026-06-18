const CHAPA_BASE_URL = process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1';

const getSecretKey = () => {
  if (!process.env.CHAPA_SECRET_KEY) {
    throw new Error('CHAPA_SECRET_KEY is not configured');
  }
  return process.env.CHAPA_SECRET_KEY;
};

const requestChapa = async (path, options = {}) => {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available in this Node.js runtime');
  }

  const response = await fetch(`${CHAPA_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || data.error || 'Chapa request failed';
    throw new Error(message);
  }

  return data;
};

exports.initializePayment = async (payload) => {
  return requestChapa('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

exports.verifyPayment = async (txRef) => {
  return requestChapa(`/transaction/verify/${encodeURIComponent(txRef)}`, {
    method: 'GET'
  });
};
