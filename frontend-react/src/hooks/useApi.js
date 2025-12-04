import { useAuth } from '../context/AuthContext';

// API Base URL - uses environment variable for production
// Why: Development = localhost:8000, Production = Render API URL
// Vite exposes env vars as import.meta.env.VITE_*
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// API Helper
async function apiRequest(endpoint, options = {}, token = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Token being sent:', token.substring(0, 20) + '...');
    } else {
        console.warn('⚠️ No token provided to API request');
    }

    console.log(`📤 API Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
        ...options,
        headers
    });

    console.log(`📥 API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
        if (response.status === 401) {
            console.error('❌ 401 Unauthorized - Token might be invalid or expired');
            // Handle unauthorized in components
            throw new Error('UNAUTHORIZED');
        }
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

// Hook for registration
export const useRegister = () => {
    const register = async (email, password, username) => {
        return await apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify({ email, password, username })
        });
    };

    return { register };
};

// Hook for login
export const useLogin = () => {
    const login = async (email, password) => {
        const formData = new URLSearchParams({
            username: email,
            password: password
        });

        const response = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return await response.json();
    };

    return { login };
};

// Hook for sending messages
export const useSendMessage = () => {
    const sendMessage = async (message, personalityId) => {
        // Get fresh token from localStorage on each call
        const token = localStorage.getItem('token');
        console.log('💬 Sending message, token exists:', !!token);
        return await apiRequest('/chat', {
            method: 'POST',
            body: JSON.stringify({
                message,
                personality_id: personalityId
            })
        }, token);
    };

    return { sendMessage };
};

// Hook for getting chat history
export const useGetChatHistory = () => {
    const getChatHistory = async () => {
        // Get fresh token from localStorage on each call
        const token = localStorage.getItem('token');
        return await apiRequest('/chat/history', {}, token);
    };

    return { getChatHistory };
};

// Hook for getting personalities
export const useGetPersonalities = () => {
    const getPersonalities = async () => {
        // Get fresh token from localStorage on each call
        const token = localStorage.getItem('token');
        return await apiRequest('/personalities', {}, token);
    };

    return { getPersonalities };
};

