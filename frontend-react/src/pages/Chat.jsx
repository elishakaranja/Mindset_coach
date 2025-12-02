import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSendMessage, useGetChatHistory, useGetPersonalities } from '../hooks/useApi';
import { formatTimestamp, escapeHtml } from '../utils';

// Personality data (should match backend)
const personalityData = {
    sophia: {
        id: 'sophia',
        name: 'Sophia',
        icon: '💫',
        tagline: 'Warm, intuitive, but won\'t let you off easy'
    },
    marcus: {
        id: 'marcus',
        name: 'Marcus',
        icon: '⚡',
        tagline: 'Stoic, direct, no-nonsense truth-teller'
    }
};

const Chat = () => {
    const navigate = useNavigate();
    const { isAuthenticated, currentPersonality, setPersonality, clearAuth } = useAuth();
    const { sendMessage } = useSendMessage();
    const { getChatHistory } = useGetChatHistory();
    const { getPersonalities } = useGetPersonalities();

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showPersonalityModal, setShowPersonalityModal] = useState(false);
    const [personalities, setPersonalities] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/onboarding');
        }
    }, [isAuthenticated, navigate]);

    // Load personalities and chat history
    useEffect(() => {
        const loadData = async () => {
            try {
                const personalitiesData = await getPersonalities();
                setPersonalities(personalitiesData);

                const history = await getChatHistory();
                setMessages(history || []);
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        if (isAuthenticated()) {
            loadData();
        }
    }, [isAuthenticated, getChatHistory, getPersonalities]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
        }
    }, [inputValue]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isSending) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setIsSending(true);

        // Add user message immediately
        const newUserMessage = {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newUserMessage]);

        // Show typing indicator
        setIsTyping(true);

        try {
            const response = await sendMessage(userMessage, currentPersonality);
            setIsTyping(false);

            if (response.response) {
                const aiMessage = {
                    role: 'assistant',
                    content: response.response,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            setIsTyping(false);
            console.error('Send message error:', error);
            // Show error message
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const handlePersonalityChange = (personalityId) => {
        setPersonality(personalityId);
        setShowPersonalityModal(false);
        // Optionally reload chat history for new personality
    };

    const handleLogout = () => {
        clearAuth();
        navigate('/');
    };

    const personality = personalityData[currentPersonality] || personalityData.sophia;

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <div className="chat-layout">
                {/* Sidebar */}
                <aside className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
                    <div className="sidebar-header">
                        <div className="sidebar-brand">
                            <span className="brand-icon">🧠</span>
                            <span className="brand-name">Mindset Coach</span>
                        </div>
                        <button className="btn-icon" id="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
                    </div>

                    <div className="sidebar-content">
                        <div className="current-personality">
                            <div className="personality-avatar">{personality.icon}</div>
                            <div className="personality-info">
                                <h3>{personality.name}</h3>
                                <p>{personality.tagline}</p>
                            </div>
                        </div>

                        <button
                            className="btn btn-ghost"
                            style={{ width: '100%', marginBottom: 'var(--spacing-4)' }}
                            onClick={() => setShowPersonalityModal(true)}
                        >
                            Change Coach
                        </button>

                        <div className="divider"></div>

                        <nav className="sidebar-nav">
                            <a href="#" className="nav-item active">
                                <span className="nav-icon">💬</span>
                                <span>Current Chat</span>
                            </a>
                            <a href="#" className="nav-item">
                                <span className="nav-icon">📊</span>
                                <span>Progress</span>
                            </a>
                            <a href="#" className="nav-item">
                                <span className="nav-icon">⚙️</span>
                                <span>Settings</span>
                            </a>
                        </nav>

                        <div className="sidebar-footer">
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ width: '100%' }}
                                onClick={handleLogout}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="chat-main">
                    <header className="chat-header">
                        <button className="btn-icon" id="sidebar-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
                        <div className="chat-title">
                            <h1 id="chat-coach-name">{personality.name}</h1>
                            <p id="chat-coach-tagline">{personality.tagline}</p>
                        </div>
                        <div className="chat-actions"></div>
                    </header>

                    <div className="chat-messages" id="chat-messages">
                        {messages.length === 0 ? (
                            <div className="welcome-message">
                                <div className="welcome-icon">👋</div>
                                <h2>Ready to start?</h2>
                                <p>Share what's on your mind, and let's work through it together.</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className={`message message-${msg.role === 'user' ? 'user' : 'ai'}`}>
                                    <div className="message-avatar">
                                        {msg.role === 'user' ? '👤' : personality.icon}
                                    </div>
                                    <div className="message-content">
                                        <div
                                            className="message-bubble"
                                            dangerouslySetInnerHTML={{ __html: escapeHtml(msg.content) }}
                                        />
                                        <div className="message-timestamp">
                                            {formatTimestamp(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {isTyping && (
                            <div className="message message-ai">
                                <div className="message-avatar">{personality.icon}</div>
                                <div className="message-content">
                                    <div className="message-bubble">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-container">
                        <form className="chat-input-form" onSubmit={handleSendMessage}>
                            <textarea
                                ref={textareaRef}
                                className="chat-input"
                                placeholder="Type your message..."
                                rows="1"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isSending}
                            />
                            <button
                                type="submit"
                                className="btn-send"
                                disabled={isSending || !inputValue.trim()}
                            >
                                <span className="send-icon">→</span>
                            </button>
                        </form>
                        <div className="chat-input-hint">
                            Press Enter to send, Shift + Enter for new line
                        </div>
                    </div>
                </main>
            </div>

            {/* Personality Selector Modal */}
            {showPersonalityModal && (
                <div className="modal-backdrop" onClick={() => setShowPersonalityModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Choose Your Coach</h2>
                            <button className="modal-close" onClick={() => setShowPersonalityModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="personality-grid">
                                {Object.values(personalityData).map(p => (
                                    <div
                                        key={p.id}
                                        className="card personality-card card-interactive"
                                        style={p.id === currentPersonality ? { borderColor: 'var(--color-accent-primary)' } : {}}
                                        onClick={() => handlePersonalityChange(p.id)}
                                    >
                                        <div className="personality-icon" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-3)' }}>
                                            {p.icon}
                                        </div>
                                        <h3 className="personality-name">{p.name}</h3>
                                        <p className="personality-tagline">{p.tagline}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Inline styles from original HTML */}
            <style>{`
        body {
          overflow: hidden;
        }

        .chat-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .chat-sidebar {
          width: var(--sidebar-width);
          background: var(--glass-background);
          backdrop-filter: blur(var(--glass-backdrop-blur));
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-normal);
        }

        .sidebar-header {
          padding: var(--spacing-4);
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          font-weight: var(--font-weight-bold);
        }

        .btn-icon {
          background: none;
          border: none;
          color: var(--color-text-secondary);
          font-size: var(--font-size-xl);
          cursor: pointer;
          padding: var(--spacing-2);
          transition: color var(--transition-fast);
        }

        .btn-icon:hover {
          color: var(--color-text-primary);
        }

        #sidebar-close {
          display: none;
        }

        .sidebar-content {
          flex: 1;
          padding: var(--spacing-4);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .current-personality {
          padding: var(--spacing-4);
          background: var(--color-background-elevated);
          border-radius: var(--border-radius-lg);
          margin-bottom: var(--spacing-4);
          text-align: center;
        }

        .personality-avatar {
          width: 60px;
          height: 60px;
          margin: 0 auto var(--spacing-3);
          border-radius: 50%;
          background: var(--gradient-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-3xl);
        }

        .personality-info h3 {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-1);
        }

        .personality-info p {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          margin: 0;
        }

        .sidebar-nav {
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          padding: var(--spacing-3);
          margin-bottom: var(--spacing-2);
          border-radius: var(--border-radius-md);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }

        .nav-item:hover {
          background: var(--color-background-elevated);
          color: var(--color-text-primary);
        }

        .nav-item.active {
          background: var(--color-background-elevated);
          color: var(--color-accent-primary);
        }

        .nav-icon {
          font-size: var(--font-size-lg);
        }

        .sidebar-footer {
          padding-top: var(--spacing-4);
          border-top: 1px solid var(--glass-border);
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          padding: var(--spacing-4) var(--spacing-6);
          background: var(--glass-background);
          backdrop-filter: blur(var(--glass-backdrop-blur));
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
        }

        #sidebar-toggle {
          display: none;
        }

        .chat-title {
          flex: 1;
        }

        .chat-title h1 {
          font-size: var(--font-size-xl);
          margin: 0;
        }

        .chat-title p {
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
          margin: 0;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-6);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .welcome-message {
          text-align: center;
          padding: var(--spacing-12) var(--spacing-6);
          max-width: 500px;
          margin: auto;
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-4);
        }

        .welcome-message h2 {
          font-size: var(--font-size-3xl);
          margin-bottom: var(--spacing-3);
        }

        .welcome-message p {
          color: var(--color-text-secondary);
        }

        .message {
          display: flex;
          gap: var(--spacing-3);
          max-width: 80%;
        }

        .message-user {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--gradient-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-lg);
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
        }

        .message-bubble {
          padding: var(--spacing-4);
          border-radius: var(--border-radius-lg);
          margin-bottom: var(--spacing-1);
          line-height: var(--line-height-relaxed);
        }

        .message-user .message-bubble {
          background: var(--gradient-accent);
          color: var(--color-background-primary);
          border-bottom-right-radius: var(--border-radius-sm);
        }

        .message-ai .message-bubble {
          background: var(--glass-background);
          backdrop-filter: blur(var(--glass-backdrop-blur));
          border: 1px solid var(--glass-border);
          border-bottom-left-radius: var(--border-radius-sm);
        }

        .message-timestamp {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          padding: 0 var(--spacing-2);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-text-tertiary);
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }

        .chat-input-container {
          padding: var(--spacing-4) var(--spacing-6);
          background: var(--glass-background);
          backdrop-filter: blur(var(--glass-backdrop-blur));
          border-top: 1px solid var(--glass-border);
        }

        .chat-input-form {
          display: flex;
          gap: var(--spacing-3);
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          min-height: 44px;
          max-height: 200px;
          padding: var(--spacing-3) var(--spacing-4);
          background: var(--color-background-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-lg);
          color: var(--color-text-primary);
          font-family: var(--font-primary);
          font-size: var(--font-size-base);
          resize: none;
          transition: border-color var(--transition-fast);
        }

        .chat-input:focus {
          outline: none;
          border-color: var(--color-accent-primary);
        }

        .btn-send {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--gradient-accent);
          border: none;
          color: var(--color-background-primary);
          font-size: var(--font-size-xl);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .btn-send:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: var(--shadow-glow-primary);
        }

        .btn-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-input-hint {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          margin-top: var(--spacing-2);
          text-align: center;
        }

        .personality-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-6);
        }

        .personality-card {
          cursor: pointer;
          text-align: center;
          padding: var(--spacing-6);
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal);
        }

        .modal {
          background: var(--color-background-primary);
          border-radius: var(--border-radius-2xl);
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: var(--spacing-6);
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: var(--font-size-2xl);
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--color-text-secondary);
          font-size: var(--font-size-2xl);
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius-md);
        }

        .modal-close:hover {
          background: var(--color-background-elevated);
        }

        .modal-body {
          padding: var(--spacing-6);
        }

        @media (max-width: 768px) {
          .chat-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: var(--z-fixed);
            transform: translateX(-100%);
          }

          .chat-sidebar.open {
            transform: translateX(0);
          }

          #sidebar-toggle {
            display: block;
          }

          #sidebar-close {
            display: block;
          }

          .message {
            max-width: 90%;
          }
        }
      `}</style>
        </div>
    );
};

export default Chat;
