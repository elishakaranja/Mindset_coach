/**
 * Onboarding Flow Logic
 * Handles personality quiz and user matching
 */

// Quiz questions
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
        tagline: 'Warm, intuitive, but won't let you off easy',
    description: 'Sophia feels like that friend who really gets you but also calls you out on your BS. She's empathetic and warm, but she'll push you when you're making excuses.',
    traits: ['Empathetic', 'Insightful', 'Warm', 'Challenging']
  },
    marcus: {
        id: 'marcus',
        name: 'Marcus',
        icon: '⚡',
        tagline: 'Stoic, direct, no-nonsense truth-teller',
        description: 'Marcus is that coach who doesn't sugarcoat anything.He's focused on what you can control, action over feelings. He's blunt but never mean.',
    traits: ['Direct', 'Action-Oriented', 'Stoic', 'Disciplined']
  }
};

// State
let currentQuestion = 0;
let scores = { sophia: 0, marcus: 0 };
let matchedPersonality = null;

// Navigation
function nextStep() {
    const steps = document.querySelectorAll('.onboarding-step');
    let currentIndex = -1;

    steps.forEach((step, index) => {
        if (step.classList.contains('active')) {
            currentIndex = index;
        }
    });

    if (currentIndex < steps.length - 1) {
        steps[currentIndex].classList.remove('active');
        steps[currentIndex + 1].classList.add('active');

        // Initialize quiz if moving to quiz step
        if (currentIndex + 1 === 1) {
            showQuestion(0);
        }
    }
}

function showQuestion(index) {
    if (index >= quizQuestions.length) {
        startMatching();
        return;
    }

    currentQuestion = index;
    const question = quizQuestions[index];

    // Update progress
    const progress = ((index + 1) / quizQuestions.length) * 100;
    document.getElementById('quiz-progress').style.width = `${progress}%`;
    document.getElementById('quiz-counter').textContent = `${index + 1} / ${quizQuestions.length}`;

    // Show question
    document.getElementById('quiz-question').textContent = question.question;

    // Show options
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, optionIndex) => {
        const optionEl = document.createElement('button');
        optionEl.className = 'quiz-option';
        optionEl.innerHTML = `
      <div class="quiz-option-label">${option.label}</div>
      <div class="quiz-option-description">${option.description}</div>
    `;
        optionEl.onclick = () => selectOption(optionIndex);
        optionsContainer.appendChild(optionEl);
    });

    // Update back button visibility
    document.getElementById('btn-prev').style.visibility = index > 0 ? 'visible' : 'hidden';
}

function selectOption(optionIndex) {
    const option = quizQuestions[currentQuestion].options[optionIndex];

    // Update scores
    Object.keys(option.score).forEach(personality => {
        scores[personality] += option.score[personality];
    });

    // Move to next question
    showQuestion(currentQuestion + 1);
}

function previousQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

function startMatching() {
    const steps = document.querySelectorAll('.onboarding-step');
    steps[1].classList.remove('active');
    steps[2].classList.add('active');

    // Determine matched personality
    matchedPersonality = scores.sophia >= scores.marcus ? 'sophia' : 'marcus';

    // Simulate matching animation
    const messages = [
        'Analyzing your responses...',
        'Understanding your preferences...',
        'Finding your perfect match...'
    ];

    let messageIndex = 0;
    const messageEl = document.getElementById('matching-message');

    const interval = setInterval(() => {
        messageIndex++;
        if (messageIndex < messages.length) {
            messageEl.textContent = messages[messageIndex];
        } else {
            clearInterval(interval);
            setTimeout(showReveal, 1000);
        }
    }, 1500);
}

function showReveal() {
    const steps = document.querySelectorAll('.onboarding-step');
    steps[2].classList.remove('active');
    steps[3].classList.add('active');

    const personality = personalities[matchedPersonality];

    document.getElementById('personality-reveal').innerHTML = `
    <div class="personality-card card" style="max-width: 500px; margin: 0 auto;">
      <div class="personality-icon" style="font-size: 4rem; margin-bottom: var(--spacing-4);">${personality.icon}</div>
      <h2 class="personality-name">${personality.name}</h2>
      <p class="personality-tagline">${personality.tagline}</p>
      <p class="personality-description">${personality.description}</p>
      <div style="display: flex; gap: var(--spacing-2); flex-wrap: wrap; justify-content: center; margin-top: var(--spacing-6);">
        ${personality.traits.map(trait => `<span class="badge badge-primary">${trait}</span>`).join('')}
      </div>
    </div>
  `;

    document.getElementById('chosen-name').textContent = personality.name;

    // Store personality choice
    window.appState.setPersonality(matchedPersonality);
}

function showAllPersonalities() {
    window.location.href = 'personalities.html';
}

function continueToSignup() {
    const steps = document.querySelectorAll('.onboarding-step');
    steps[3].classList.remove('active');
    steps[4].classList.add('active');
}

function showLogin() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

// Form handlers
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating account...';

                await window.api.register(email, password, username);

                // Auto-login
                const loginResult = await window.api.login(email, password);
                window.appState.setToken(loginResult.access_token);

                window.UI.toast('Account created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'chat.html';
                }, 1000);
            } catch (error) {
                window.UI.toast('Failed to create account. Please try again.', 'error');
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account & Start';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Signing in...';

                const result = await window.api.login(email, password);
                window.appState.setToken(result.access_token);

                window.UI.toast('Welcome back!', 'success');
                setTimeout(() => {
                    window.location.href = 'chat.html';
                }, 500);
            } catch (error) {
                window.UI.toast('Invalid credentials. Please try again.', 'error');
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            }
        });
    }
});

// Export functions globally for onclick handlers
window.nextStep = nextStep;
window.showQuestion = showQuestion;
window.selectOption = selectOption;
window.previousQuestion = previousQuestion;
window.showAllPersonalities = showAllPersonalities;
window.continueToSignup = continueToSignup;
window.showLogin = showLogin;
window.showSignup = showSignup;
