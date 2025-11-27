/**
 * Personality Selector Component
 * Handles personality selection and navigation
 */

function selectCoach(personalityId) {
    // Store selection
    window.appState.setPersonality(personalityId);

    // Show toast
    const personalities = {
        sophia: 'Sophia',
        marcus: 'Marcus'
    };

    window.UI.toast(`Great choice! ${personalities[personalityId]} is ready to help you grow.`, 'success');

    // Navigate to onboarding or chat
    setTimeout(() => {
        if (window.appState.isAuthenticated()) {
            window.location.href = 'chat.html';
        } else {
            window.location.href = 'onboarding.html#signup';
        }
    }, 1000);
}

// Make function globally available
window.selectCoach = selectCoach;
