const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const handleResponse = async (res) => {
    if (!res.ok) {
        let errorData;
        try {
            errorData = await res.json();
        } catch {
            throw new Error(`HTTP Error ${res.status}`);
        }
        throw new Error(errorData.message || `HTTP Error ${res.status}`);
    }
    return await res.json();
};

export const api = {
    createOrder: async (orderData) => {
        try {
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
