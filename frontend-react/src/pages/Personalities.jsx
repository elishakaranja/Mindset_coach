import { Link } from 'react-router-dom';

const Personalities = () => {
    return (
        <div className="animated-gradient-bg" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Choose Your AI Coach</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💫</div>
                        <h2>Sophia</h2>
                        <p style={{ color: 'var(--color-text-tertiary)' }}>Warm, intuitive, but won't let you off easy</p>
                    </div>
                    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚡</div>
                        <h2>Marcus</h2>
                        <p style={{ color: 'var(--color-text-tertiary)' }}>Stoic, direct, no-nonsense truth-teller</p>
                    </div>
                </div>
                <Link to="/onboarding" className="btn btn-primary btn-xl">
                    Start Your Journey
                </Link>
            </div>
        </div>
    );
};

export default Personalities;
