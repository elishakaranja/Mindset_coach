import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setTokenState] = useState(localStorage.getItem('token') || null);
    const [currentPersonality, setCurrentPersonalityState] = useState(
        localStorage.getItem('personality') || null
    );

    const setToken = (newToken) => {
        setTokenState(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    const setPersonality = (personality) => {
        setCurrentPersonalityState(personality);
        localStorage.setItem('personality', personality);
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);
        setCurrentPersonalityState(null);
        localStorage.removeItem('token');
        localStorage.removeItem('personality');
    };

    const isAuthenticated = () => {
        return !!token;
    };

    const value = {
        user,
        token,
        currentPersonality,
        setUser,
        setToken,
        setPersonality,
        clearAuth,
        isAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
