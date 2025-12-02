import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRegister, useLogin } from '../hooks/useApi';

// Quiz questions (from OnboardingFlow.js)
const quizQuestions = [
    {
        question: "When facing a challenge, what do you need most?",
        options: [
            {
                label: "Someone who understands how I feel",
                description: "Empathy and emotional support",
                score: { sophia: 2, marcus: 0 }
            },
            {
                label: "Direct advice on what to do",
                description: "Clear, actionable steps",
                score: { sophia: 0, marcus: 2 }
            },
            {
                label: "A mix of both",
                description: "Understanding and guidance",
                score: { sophia: 1, marcus: 1 }
            }
        ]
    },
    {
        question: "How do you prefer to be challenged?",
        options: [
            {
                label: "With tough questions that make me think",
                description: "Thoughtful, probing conversations",
                score: { sophia: 2, marcus: 0 }
            },
            {
                label: "With direct, no-nonsense truth",
                description: "Blunt honesty and real talk",
                score: { sophia: 0, marcus: 2 }
            },
            {
                label: "A balance of both",
                description: "Mix of gentleness and directness",
                score: { sophia: 1, marcus: 1 }
            }
        ]
    },
    {
        question: "When you're making excuses, you want someone to:",
        options: [
            {
                label: "Call me out, but gently",
                description: "Caring confrontation",
                score: { sophia: 2, marcus: 0 }
            },
            {
                label: "Cut through the BS immediately",
                description: "Zero tolerance for excuses",
                score: { sophia: 0, marcus: 2 }
            },
            {
                label: "Depends on my mood",
                description: "Flexible approach",
                score: { sophia: 1, marcus: 1 }
            }
        ]
    }
];

// Personality data
const personalities = {
    sophia: {
        id: 'sophia',
        name: 'Sophia',
        icon: '💫',
        tagline: 'Warm, intuitive, but won\'t let you off easy',
        description: 'Sophia feels like that friend who really gets you but also calls you out on your BS. She\'s empathetic and warm, but she\'ll push you when you\'re making excuses.',
        traits: ['Empathetic', 'Insightful', 'Warm', 'Challenging']
    },
    marcus: {
        id: 'marcus',
        name: 'Marcus',
        icon: '⚡',
        tagline: 'Stoic, direct, no-nonsense truth-teller',
        description: 'Marcus is that coach who doesn\'t sugarcoat anything. He\'s focused on what you can control, action over feelings. He\'s blunt but never mean.',
        traits: ['Direct', 'Action-Oriented', 'Stoic', 'Disciplined']
    }
};

const Onboarding = () => {
    const navigate = useNavigate();
    const { setToken, setPersonality } = useAuth();
    const { register } = useRegister();
    const { login } = useLogin();

    const [step, setStep] = useState('welcome'); // welcome, quiz, matching, reveal, signup
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [scores, setScores] = useState({ sophia: 0, marcus: 0 });
    const [matchedPersonality, setMatchedPersonality] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStartQuiz = () => {
        setStep('quiz');
    };

    const handleSelectOption = (optionIndex) => {
        const option = quizQuestions[currentQuestion].options[optionIndex];

        // Update scores
        const newScores = { ...scores };
        Object.keys(option.score).forEach(personality => {
            newScores[personality] += option.score[personality];
        });
        setScores(newScores);

        // Move to next question or start matching
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            startMatching(newScores);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const startMatching = (finalScores) => {
        setStep('matching');

        // Simulate matching animation
        const messages = [
            'Analyzing your responses...',
            'Understanding your preferences...',
            'Finding your perfect match...'
        ];

        let messageIndex = 0;
        const interval = setInterval(() => {
            messageIndex++;
            if (messageIndex >= messages.length) {
                clearInterval(interval);
                setTimeout(() => showReveal(finalScores), 1000);
            }
        }, 1500);
    };

    const showReveal = (finalScores) => {
        const matched = finalScores.sophia >= finalScores.marcus ? 'sophia' : 'marcus';
        setMatchedPersonality(matched);
        setPersonality(matched);
        setStep('reveal');
    };

    const handleContinueToSignup = () => {
        setStep('signup');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            await register(email, password, username);
            const loginResult = await login(email, password);
            setToken(loginResult.access_token);
            navigate('/chat');
        } catch (err) {
            setError('Failed to create account. Please try again.');
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const result = await login(email, password);
            setToken(result.access_token);
            navigate('/chat');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            setIsLoading(false);
        }
    };

    const personality = personalities[matchedPersonality];
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
        <div className="animated-gradient-bg onboarding-container">
            {/* Welcome Step */}
            {step === 'welcome' && (
                <div className="onboarding-step active">
                    <div className="onboarding-content">
                        <div className="welcome-icon">🧠</div>
                        <h1 className="onboarding-title">Welcome to Mindset Coach</h1>
                        <p className="onboarding-subtitle">Let's find the perfect coach for your journey</p>
                        <p className="onboarding-description">
                            In the next 2 minutes, we'll match you with an AI coach personality that fits your style.
                        </p>
                        <button className="btn btn-primary btn-xl" onClick={handleStartQuiz}>
                            Let's Begin
                            <span>→</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Quiz Step */}
            {step === 'quiz' && (
                <div className="onboarding-step active">
                    <div className="onboarding-content">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <h2 className="onboarding-title">Quick Question</h2>
                        <p className="quiz-question">{quizQuestions[currentQuestion].question}</p>
                        <div className="quiz-options">
                            {quizQuestions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    className="quiz-option"
                                    onClick={() => handleSelectOption(index)}
                                >
                                    <div className="quiz-option-label">{option.label}</div>
                                    <div className="quiz-option-description">{option.description}</div>
                                </button>
                            ))}
                        </div>
                        <div className="quiz-navigation">
                            <button
                                className="btn btn-ghost"
                                onClick={handlePreviousQuestion}
                                style={{ visibility: currentQuestion > 0 ? 'visible' : 'hidden' }}
                            >
                                ← Back
                            </button>
                            <span className="quiz-counter">
                                {currentQuestion + 1} / {quizQuestions.length}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Matching Step */}
            {step === 'matching' && (
                <div className="onboarding-step active">
                    <div className="onboarding-content">
                        <div className="matching-animation">
                            <div className="loading-spinner loading-lg"></div>
                            <div className="matching-text">
                                <h2>Personalizing your experience...</h2>
                                <p>Finding your perfect match...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reveal Step */}
            {step === 'reveal' && personality && (
                <div className="onboarding-step active">
                    <div className="onboarding-content">
                        <div className="reveal-badge">✨ Your Perfect Match</div>
                        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                            <div className="personality-icon" style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }}>
                                {personality.icon}
                            </div>
                            <h2 className="personality-name">{personality.name}</h2>
                            <p className="personality-tagline">{personality.tagline}</p>
                            <p className="personality-description">{personality.description}</p>
                            <div style={{
                                display: 'flex',
                                gap: 'var(--spacing-2)',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                marginTop: 'var(--spacing-6)'
                            }}>
                                {personality.traits.map(trait => (
                                    <span key={trait} className="badge badge-primary">{trait}</span>
                                ))}
                            </div>
                        </div>
                        <div className="reveal-actions">
                            <button
                                className="btn btn-ghost"
                                onClick={() => navigate('/personalities')}
                            >
                                View All Coaches
                            </button>
                            <button className="btn btn-primary btn-xl" onClick={handleContinueToSignup}>
                                Continue with {personality.name}
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Signup Step */}
            {step === 'signup' && (
                <div className="onboarding-step active">
                    <div className="onboarding-content">
                        <h2 className="onboarding-title">Create Your Account</h2>
                        <p className="onboarding-subtitle">Start your personal growth journey today</p>

                        {error && (
                            <div style={{
                                color: 'var(--color-error)',
                                marginBottom: 'var(--spacing-4)',
                                padding: 'var(--spacing-3)',
                                background: 'rgba(255, 107, 53, 0.1)',
                                borderRadius: 'var(--border-radius-md)'
                            }}>
                                {error}
                            </div>
                        )}

                        {!showLogin ? (
                            <form className="auth-form" onSubmit={handleSignup}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="form-input"
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-input"
                                        placeholder="Create a secure password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-xl"
                                    style={{ width: '100%', marginTop: 'var(--spacing-4)' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating account...' : 'Create Account & Start'}
                                </button>

                                <p className="auth-note">
                                    Already have an account?{' '}
                                    <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>
                                        Sign in
                                    </a>
                                </p>
                            </form>
                        ) : (
                            <form className="auth-form" onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="login-email">Email</label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        name="email"
                                        className="form-input"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="login-password">Password</label>
                                    <input
                                        type="password"
                                        id="login-password"
                                        name="password"
                                        className="form-input"
                                        placeholder="Your password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-xl"
                                    style={{ width: '100%', marginTop: 'var(--spacing-4)' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </button>

                                <p className="auth-note">
                                    Don't have an account?{' '}
                                    <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(false); }}>
                                        Create one
                                    </a>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Inline styles from original HTML */}
            <style>{`
        .onboarding-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-6);
        }

        .onboarding-step {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .onboarding-step.active {
          animation: fadeIn var(--transition-normal) var(--ease-out);
        }

        .onboarding-content {
          background: var(--glass-background);
          backdrop-filter: blur(var(--glass-backdrop-blur));
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-2xl);
          padding: var(--spacing-12);
          text-align: center;
        }

        .welcome-icon {
          font-size: 6rem;
          margin-bottom: var(--spacing-6);
        }

        .onboarding-title {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-4);
        }

        .onboarding-subtitle {
          font-size: var(--font-size-xl);
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-6);
        }

        .onboarding-description {
          color: var(--color-text-tertiary);
          margin-bottom: var(--spacing-8);
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: var(--color-background-tertiary);
          border-radius: var(--border-radius-full);
          margin-bottom: var(--spacing-8);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-accent);
          transition: width var(--transition-normal) var(--ease-out);
        }

        .quiz-question {
          font-size: var(--font-size-2xl);
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-8);
          line-height: var(--line-height-relaxed);
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-8);
        }

        .quiz-option {
          padding: var(--spacing-5);
          background: var(--color-background-elevated);
          border: 2px solid transparent;
          border-radius: var(--border-radius-lg);
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .quiz-option:hover {
          border-color: var(--color-accent-primary);
          transform: translateX(4px);
        }

        .quiz-option-label {
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-2);
        }

        .quiz-option-description {
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
        }

        .quiz-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quiz-counter {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }

        .matching-animation {
          padding: var(--spacing-12) 0;
        }

        .loading-lg {
          width: 60px;
          height: 60px;
          border-width: 6px;
          margin: 0 auto var(--spacing-6);
        }

        .matching-text h2 {
          font-size: var(--font-size-3xl);
          margin-bottom: var(--spacing-3);
        }

        .matching-text p {
          color: var(--color-text-tertiary);
          animation: pulse 2s infinite;
        }

        .reveal-badge {
          display: inline-block;
          padding: var(--spacing-2) var(--spacing-4);
          background: rgba(0, 212, 255, 0.2);
          border: 1px solid var(--color-accent-primary);
          border-radius: var(--border-radius-full);
          color: var(--color-accent-primary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--spacing-6);
        }

        .reveal-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          margin-top: var(--spacing-8);
        }

        .auth-form {
          max-width: 400px;
          margin: var(--spacing-8) auto 0;
          text-align: left;
        }

        .auth-note {
          text-align: center;
          margin-top: var(--spacing-4);
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }

        .auth-note a {
          color: var(--color-accent-primary);
          font-weight: var(--font-weight-medium);
        }

        @media (max-width: 600px) {
          .onboarding-content {
            padding: var(--spacing-8);
          }

          .onboarding-title {
            font-size: var(--font-size-3xl);
          }
        }
      `}</style>
        </div>
    );
};

export default Onboarding;
