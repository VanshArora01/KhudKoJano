const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const BASE_URL = getBaseUrl();

const handleResponse = async (res) => {
    const text = await res.text();

    if (!res.ok) {
        let errorData;
        try {
            errorData = JSON.parse(text);
        } catch {
            throw new Error(`HTTP Error ${res.status}: ${text || 'Unknown Error'}`);
        }
        throw new Error(errorData.message || `HTTP Error ${res.status}`);
    }

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error('JSON Parse Error. Raw response:', text);
        throw new Error('Malformed response from server');
    }
};

export const api = {
    createOrder: async (orderData) => {
        try {
            console.log(`Calling API: ${BASE_URL}/api/orders/create`);
            const res = await fetch(`${BASE_URL}/api/orders/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            return await handleResponse(res);
        } catch (err) {
            console.error('API createOrder error:', err.message);
            throw err;
        }
    },

    verifyPayment: async (paymentData) => {
        try {
            const res = await fetch(`${BASE_URL}/api/orders/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });
            return await handleResponse(res);
        } catch (err) {
            console.error('API verifyPayment error:', err.message);
            throw err;
        }
    },

    getOrderStatus: async (orderId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/orders/status/${orderId}`);
            return await handleResponse(res);
        } catch (err) {
            console.error('API getOrderStatus error:', err.message);
            throw err;
        }
    }
};
