/**
 * Main Application Logic
 * Handles routing, state management, and API integration
 */

// Configuration
const API_BASE_URL = 'http://localhost:8000';

// State Management
class AppState {
    constructor() {
        this.user = null;
        this.token = localStorage.getItem('token') || null;
        this.currentPersonality = localStorage.getItem('personality') || null;
    }

    setUser(user) {
        this.user = user;
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    setPersonality(personality) {
        this.currentPersonality = personality;
        localStorage.setItem('personality', personality);
    }

    clearAuth() {
        this.user = null;
        this.token = null;
        this.currentPersonality = null;
        localStorage.removeItem('token');
        localStorage.removeItem('personality');
    }

    isAuthenticated() {
        return !!this.token;
    }
}

// Initialize global state
window.appState = new AppState();

// API Client
class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (window.appState.token) {
            headers['Authorization'] = `Bearer ${window.appState.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.appState.clearAuth();
                    window.location.href = '/';
                }
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(email, password, username) {
        const response = await this.request('/users', {
            method: 'POST',
            body: JSON.stringify({ email, password, username })
        });
        return response;
    }

    async login(email, password) {
        const formData = new URLSearchParams({
            username: email,
            password: password
        });

        const response = await fetch(`${this.baseURL}/token`, {
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
    }

    // Chat endpoints
    async sendMessage(message, personalityId) {
        return await this.request('/chat', {
            method: 'POST',
            body: JSON.stringify({
                message,
                personality_id: personalityId
            })
        });
    }

    async getChatHistory() {
        return await this.request('/chat/history');
    }

    // Personality endpoints
    async getPersonalities() {
        return await this.request('/personalities');
    }
}

// Initialize API client
window.api = new APIClient(API_BASE_URL);

// UI Utilities
const UI = {
    showLoading(element, text = 'Loading...') {
        element.innerHTML = `
      <div class="loading-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem;">
        <div class="loading-spinner"></div>
        <p style="margin-top: 1rem; color: var(--color-text-secondary);">${text}</p>
      </div>
    `;
    },

    showError(element, message) {
        element.innerHTML = `
      <div class="error-container" style="padding: 2rem; text-align: center;">
        <p style="color: var(--color-error); font-size: var(--font-size-lg);">❌ ${message}</p>
      </div>
    `;
    },

    toast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: var(--glass-background);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius-lg);
      backdrop-filter: blur(var(--glass-backdrop-blur));
      box-shadow: var(--shadow-xl);
      z-index: var(--z-tooltip);
      animation: slideInRight var(--transition-normal) var(--ease-out);
    `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut var(--transition-fast) var(--ease-in)';
            setTimeout(() => toast.remove(), 200);
        }, 3000);
    },

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'just now';
    }
};

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initScrollReveal();
    initSmoothScroll();

    // Add revealed class to stagger items after a delay
    setTimeout(() => {
        document.querySelectorAll('.stagger-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
            }, index * 100);
        });
    }, 500);
});

// Export for use in other modules
window.UI = UI;
