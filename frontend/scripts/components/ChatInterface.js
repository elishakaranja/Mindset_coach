/**
 * Chat Interface Component
 * Handles real-time messaging and chat UI
 */

// Personality data (should match backend)
const personalityData = {
    sophia: {
        id: 'sophia',
        name: 'Sophia',
        icon: '💫',
        tagline: 'Warm, intuitive, but won't let you off easy'
  },
    marcus: {
        id: 'marcus',
        name: 'Marcus',
        icon: '⚡',
        tagline: 'Stoic, direct, no-nonsense truth-teller'
    }
};

// Chat state
let isTyping = false;
let messageHistory = [];

// Initialize chat interface
async function initChat() {
    // Check authentication
    if (!window.appState.isAuthenticated()) {
        window.location.href = 'onboarding.html';
        return;
    }

    // Load personalities from API
    try {
        const personalities = await window.api.getPersonalities();

        // If no personality selected, show selector
        if (!window.appState.currentPersonality && personalities.length > 0) {
            window.appState.setPersonality(personalities[0].id);
        }

        updateCurrentPersonalityDisplay();
        loadChatHistory();
    } catch (error) {
        console.error('Failed to initialize chat:', error);
        window.UI.toast('Failed to load chat. Please refresh.', 'error');
    }
}

// Update personality display
function updateCurrentPersonalityDisplay() {
    const personalityId = window.appState.currentPersonality;
    const personality = personalityData[personalityId];

    if (!personality) return;

    // Update sidebar
    document.getElementById('current-personality').innerHTML = `
    <div class="personality-avatar">${personality.icon}</div>
    <div class="personality-info">
      <h3>${personality.name}</h3>
      <p>${personality.tagline}</p>
    </div>
  `;

    // Update chat header
    document.getElementById('chat-coach-name').textContent = personality.name;
    document.getElementById('chat-coach-tagline').textContent = personality.tagline;
}

// Load chat history
async function loadChatHistory() {
    try {
        const history = await window.api.getChatHistory();
        messageHistory = history;

        const messagesContainer = document.getElementById('chat-messages');

        if (history.length === 0) {
            // Show welcome message
            return;
        }

        // Clear welcome message
        messagesContainer.innerHTML = '';

        // Render messages
        history.forEach(msg => {
            appendMessage(msg.role === 'user' ? 'user' : 'ai', msg.content, msg.timestamp, false);
        });

        scrollToBottom();
    } catch (error) {
        console.error('Failed to load chat history:', error);
    }
}

// Append message to chat
function appendMessage(role, content, timestamp = new Date(), animate = true) {
    const messagesContainer = document.getElementById('chat-messages');

    // Remove welcome message if present
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = `message message-${role}`;
    if (animate) {
        messageEl.classList.add('message-enter');
        setTimeout(() => messageEl.classList.add('message-enter-active'), 10);
    }

    const personality = personalityData[window.appState.currentPersonality];
    const avatar = role === 'user' ? '👤' : (personality?.icon || '🤖');

    messageEl.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="message-bubble">${escapeHtml(content)}</div>
      <div class="message-timestamp">${window.UI.formatTimestamp(timestamp)}</div>
    </div>
  `;

    messagesContainer.appendChild(messageEl);

    if (animate) {
        scrollToBottom(true);
    }
}

// Show typing indicator
function showTyping() {
    if (isTyping) return;

    isTyping = true;
    const messagesContainer = document.getElementById('chat-messages');

    const typingEl = document.createElement('div');
    typingEl.className = 'message message-ai typing-message';
    typingEl.id = 'typing-indicator';

    const personality = personalityData[window.appState.currentPersonality];

    typingEl.innerHTML = `
    <div class="message-avatar">${personality?.icon || '🤖'}</div>
    <div class="message-content">
      <div class="message-bubble">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `;

    messagesContainer.appendChild(typingEl);
    scrollToBottom(true);
}

// Hide typing indicator
function hideTyping() {
    isTyping = false;
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
        typingEl.remove();
    }
}

// Send message
async function sendMessage(content) {
    if (!content.trim()) return;

    // Append user message immediately
    appendMessage('user', content, new Date(), true);

    // Clear input
    document.getElementById('message-input').value = '';
    autoResizeTextarea();

    // Show typing
    showTyping();

    // Disable send button
    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;

    try {
        const response = await window.api.sendMessage(content, window.appState.currentPersonality);

        hideTyping();

        // Append AI response
        if (response.response) {
            appendMessage('ai', response.response, new Date(), true);
        }
    } catch (error) {
        hideTyping();
        window.UI.toast('Failed to send message. Please try again.', 'error');
        console.error('Send message error:', error);
    } finally {
        sendBtn.disabled = false;
        document.getElementById('message-input').focus();
    }
}

// Handle form submit
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage(messageInput.value);
        });
    }

    if (messageInput) {
        // Auto-resize textarea
        messageInput.addEventListener('input', autoResizeTextarea);

        // Handle Enter key
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(messageInput.value);
            }
        });
    }

    // Sidebar toggle (mobile)
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Initialize
    initChat();
});

// Auto-resize textarea
function autoResizeTextarea() {
    const textarea = document.getElementById('message-input');
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

// Scroll to bottom
function scrollToBottom(smooth = false) {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

// Show personality selector
async function showPersonalitySelector() {
    try {
        const personalities = await window.api.getPersonalities();

        const optionsContainer = document.getElementById('personality-options');
        optionsContainer.innerHTML = '';

        personalities.forEach(p => {
            const data = personalityData[p.id];
            const card = document.createElement('div');
            card.className = 'card personality-card card-interactive';
            if (p.id === window.appState.currentPersonality) {
                card.style.borderColor = 'var(--color-accent-primary)';
            }

            card.innerHTML = `
        <div class="personality-icon">${data?.icon || '🤖'}</div>
        <h3 class="personality-name">${p.name}</h3>
        <p class="personality-tagline">${p.tagline}</p>
        <p class="personality-description">${p.description}</p>
      `;

            card.addEventListener('click', () => selectPersonality(p.id));
            optionsContainer.appendChild(card);
        });

        document.getElementById('personality-modal').classList.remove('hidden');
    } catch (error) {
        window.UI.toast('Failed to load personalities', 'error');
    }
}

// Select personality
function selectPersonality(personalityId) {
    window.appState.setPersonality(personalityId);
    updateCurrentPersonalityDisplay();
    closePersonalitySelector();
    window.UI.toast(`Switched to ${personalityData[personalityId].name}`, 'success');

    // Reload chat
    loadChatHistory();
}

// Close personality selector
function closePersonalitySelector() {
    document.getElementById('personality-modal').classList.add('hidden');
}

// Logout
function logout() {
    window.appState.clearAuth();
    window.location.href = 'index.html';
}

// Utility: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export functions for global access
window.showPersonalitySelector = showPersonalitySelector;
window.closePersonalitySelector = closePersonalitySelector;
window.logout = logout;
