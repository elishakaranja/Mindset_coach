import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    useEffect(() => {
        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

        // Scroll Reveal Animation
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

        // Smooth Scroll
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

        // Stagger animation for use cases
        setTimeout(() => {
            document.querySelectorAll('.stagger-item').forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                }, index * 100);
            });
        }, 500);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="animated-gradient-bg">
            {/* Navigation */}
            <nav className="nav">
                <div className="container">
                    <div className="nav-content">
                        <div className="nav-brand">
                            <span className="brand-icon">🧠</span>
                            <span className="brand-name">Mindset Coach</span>
                        </div>
                        <div className="nav-links">
                            <a href="#features" className="nav-link">Features</a>
                            <a href="#science" className="nav-link">The Science</a>
                            <a href="#faq" className="nav-link">FAQ</a>
                            <Link to="/chat" className="btn btn-primary btn-sm">Start Free</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge animate-fade-in">
                            <span className="badge badge-primary">✨ Evidence-Based AI Coaching</span>
                        </div>
                        <h1 className="hero-title animate-slide-in-up">
                            Transform Your Mindset.<br />
                            Achieve Your Goals.
                        </h1>
                        <p className="hero-subtitle animate-slide-in-up">
                            Your personal mindset coach powered by AI. Built on proven CBT and positive psychology principles.
                            Get personalized guidance that adapts to your unique thought patterns and goals.
                        </p>
                        <div className="hero-cta animate-slide-in-up">
                            <Link to="/onboarding" className="btn btn-primary btn-xl">
                                Start Your Journey
                                <span>→</span>
                            </Link>
                            <p className="hero-cta-note">Free to start • No credit card required</p>
                        </div>

                        {/* Use Cases */}
                        <div className="use-cases">
                            <div className="use-case-card stagger-item">
                                <div className="use-case-icon">💪</div>
                                <h3>Build Confidence</h3>
                                <p>Overcome limiting beliefs and self-doubt</p>
                            </div>
                            <div className="use-case-card stagger-item">
                                <div className="use-case-icon">🎯</div>
                                <h3>Achieve Goals</h3>
                                <p>Create actionable plans and stay motivated</p>
                            </div>
                            <div className="use-case-card stagger-item">
                                <div className="use-case-icon">🧘</div>
                                <h3>Manage Stress</h3>
                                <p>Develop healthy coping strategies</p>
                            </div>
                            <div className="use-case-card stagger-item">
                                <div className="use-case-icon">🚀</div>
                                <h3>Personal Growth</h3>
                                <p>Build self-awareness and resilience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Mindset Coach?</h2>
                        <p className="section-subtitle">Your personal growth companion, designed to help you thrive</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card card scroll-reveal">
                            <div className="feature-icon">🎭</div>
                            <h3>Distinct AI Personalities</h3>
                            <p>Choose a coach that matches your style - from warm and empathetic to direct and stoic. Each personality is designed to feel real and human.</p>
                        </div>

                        <div className="feature-card card scroll-reveal">
                            <div className="feature-icon">🧠</div>
                            <h3>Evidence-Based Techniques</h3>
                            <p>Built on proven CBT, positive psychology, and growth mindset research. Not just motivational quotes - actual psychological frameworks.</p>
                        </div>

                        <div className="feature-card card scroll-reveal">
                            <div className="feature-icon">💬</div>
                            <h3>Deep, Meaningful Conversations</h3>
                            <p>Your coach remembers your goals, challenges, and progress. Conversations build on each other, creating lasting impact.</p>
                        </div>

                        <div className="feature-card card scroll-reveal">
                            <div className="feature-icon">📈</div>
                            <h3>Track Your Growth</h3>
                            <p>See your progress over time with insights into your patterns, breakthroughs, and areas of development.</p>
                        </div>

                        <div className="feature-card card scroll-reveal">
                            <div className="feature-icon">🔒</div>
                            <h3>Private & Secure</h3>
                            <p>Your conversations are completely private. We take your data security seriously.</p>
                        </div>

                        <div className="feature-card card scroll-reveal">
                            <div className="feature-icon">⚡</div>
                            <h3>Available 24/7</h3>
                            <p>Get support whenever you need it. Early morning breakthrough or late night reflection - your coach is always there.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Science Section */}
            <section id="science" className="section science-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Built on Science, Designed for You</h2>
                        <p className="section-subtitle">Evidence-based coaching that actually works</p>
                    </div>

                    <div className="science-content">
                        <div className="science-card card-elevated">
                            <div className="science-stat">
                                <div className="stat-number">80%</div>
                                <div className="stat-label">Effectiveness Rate</div>
                            </div>
                            <p>Cognitive Behavioral Therapy (CBT) shows an 80% effectiveness rate for improving mental health outcomes</p>
                            <a href="#" className="science-link">Learn about CBT →</a>
                        </div>

                        <div className="science-card card-elevated">
                            <div className="science-stat">
                                <div className="stat-number">40%</div>
                                <div className="stat-label">Performance Boost</div>
                            </div>
                            <p>Growth mindset interventions improve academic and professional performance by up to 40%</p>
                            <a href="#" className="science-link">Carol Dweck's Research →</a>
                        </div>

                        <div className="science-card card-elevated">
                            <div className="science-stat">
                                <div className="stat-icon">🧬</div>
                                <div className="stat-label">Neuroplasticity</div>
                            </div>
                            <p>Your brain can change and adapt throughout your life. Our techniques leverage this power.</p>
                            <a href="#" className="science-link">The Science Behind It →</a>
                        </div>
                    </div>

                    <div className="credibility-badges">
                        <div className="badge-item">✅ Evidence-Based Techniques</div>
                        <div className="badge-item">✅ Expert-Designed</div>
                        <div className="badge-item">✅ Privacy-First</div>
                        <div className="badge-item">✅ Personalized Approach</div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="section testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">See What Users Are Saying</h2>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card card">
                            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">"Sophia calls me out on my excuses in the best way. I've made more progress in 2 weeks than I did in 6 months of journaling."</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">A</div>
                                <div className="author-info">
                                    <div className="author-name">Alex K.</div>
                                    <div className="author-role">Software Engineer</div>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card card">
                            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">"Marcus doesn't sugarcoat anything, and honestly, that's what I needed. He helped me take action instead of just talking about my problems."</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">S</div>
                                <div className="author-info">
                                    <div className="author-name">Sarah M.</div>
                                    <div className="author-role">Marketing Manager</div>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card card">
                            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">"It's like having a therapist in my pocket, but more real and less formal. The conversations actually stick with me."</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">J</div>
                                <div className="author-info">
                                    <div className="author-name">Jordan P.</div>
                                    <div className="author-role">Entrepreneur</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="section faq-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                    </div>

                    <div className="faq-list">
                        <div className="faq-item">
                            <button className="faq-question">
                                <span>Is this a replacement for therapy?</span>
                                <span className="faq-icon">+</span>
                            </button>
                            <div className="faq-answer">
                                <p>No, Mindset Coach is a personal development tool, not a replacement for professional therapy. If you're dealing with serious mental health issues, please seek help from a licensed therapist. Think of us as a coach for personal growth, not clinical treatment.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-question">
                                <span>How is this different from ChatGPT?</span>
                                <span className="faq-icon">+</span>
                            </button>
                            <div className="faq-answer">
                                <p>Our AI coaches have distinct personalities designed specifically for mindset coaching. They remember your goals, track your progress, and use evidence-based psychological frameworks. It's a purpose-built experience, not a general chatbot.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-question">
                                <span>Is my data private and secure?</span>
                                <span className="faq-icon">+</span>
                            </button>
                            <div className="faq-answer">
                                <p>Absolutely. Your conversations are encrypted and private. We never sell your data or use it for advertising. Your personal growth journey is yours alone.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-question">
                                <span>Can I switch between personalities?</span>
                                <span className="faq-icon">+</span>
                            </button>
                            <div className="faq-answer">
                                <p>Yes! You can switch anytime. Some users prefer Sophia's warm approach for emotional topics and Marcus's directness for goal-setting. Find what works for you.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-question">
                                <span>How much does it cost?</span>
                                <span className="faq-icon">+</span>
                            </button>
                            <div className="faq-answer">
                                <p>You can start for free with limited conversations. Premium plans start at $10/month for unlimited access. We believe mindset coaching should be accessible to everyone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Transform Your Mindset?</h2>
                        <p className="cta-subtitle">Join thousands of users building confidence, achieving goals, and living with purpose.</p>
                        <Link to="/onboarding" className="btn btn-primary btn-xl">
                            Start Your Free Journey
                            <span>→</span>
                        </Link>
                        <p className="cta-note">Takes less than 2 minutes to get started</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <span className="brand-icon">🧠</span>
                            <span className="brand-name">Mindset Coach</span>
                            <p className="footer-tagline">Your AI-powered personal growth companion</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Product</h4>
                                <a href="#features">Features</a>
                                <a href="#science">The Science</a>
                                <Link to="/personalities">Personalities</Link>
                            </div>
                            <div className="footer-column">
                                <h4>Support</h4>
                                <a href="#faq">FAQ</a>
                                <a href="#">Contact</a>
                                <a href="#">Help Center</a>
                            </div>
                            <div className="footer-column">
                                <h4>Legal</h4>
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 Mindset Coach. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Inline styles from original HTML */}
            <style>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(10, 14, 39, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(184, 193, 236, 0.1);
          z-index: var(--z-fixed);
          padding: var(--spacing-4) 0;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
        }

        .brand-icon {
          font-size: var(--font-size-2xl);
        }

        .nav-links {
          display: flex;
          gap: var(--spacing-6);
          align-items: center;
        }

        .nav-link {
          color: var(--color-text-secondary);
          font-weight: var(--font-weight-medium);
          transition: color var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--color-text-primary);
        }

        .hero {
          padding: calc(var(--header-height) + var(--spacing-20)) 0 var(--spacing-20);
          text-align: center;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-badge {
          margin-bottom: var(--spacing-6);
        }

        .hero-title {
          font-size: var(--font-size-6xl);
          background: linear-gradient(135deg, var(--color-text-primary), var(--color-accent-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-6);
        }

        .hero-subtitle {
          font-size: var(--font-size-xl);
          color: var(--color-text-secondary);
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--spacing-8);
        }

        .hero-cta {
          margin-bottom: var(--spacing-16);
        }

        .hero-cta-note {
          margin-top: var(--spacing-3);
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
        }

        .use-cases {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-6);
          margin-top: var(--spacing-16);
        }

        .use-case-card {
          padding: var(--spacing-6);
          background: var(--glass-background);
          backdrop-filter: blur(var(--glass-backdrop-blur));
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-xl);
          transition: all var(--transition-normal);
          opacity: 0;
        }

        .use-case-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent-primary);
        }

        .use-case-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-3);
        }

        .use-case-card h3 {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-2);
        }

        .use-case-card p {
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
          margin: 0;
        }

        .section {
          padding: var(--spacing-20) 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-12);
        }

        .section-title {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-4);
        }

        .section-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-text-secondary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-8);
        }

        .feature-card {
          padding: var(--spacing-8);
        }

        .feature-icon {
          font-size: var(--font-size-5xl);
          margin-bottom: var(--spacing-4);
        }

        .feature-card h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-3);
        }

        .science-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-8);
          margin-bottom: var(--spacing-12);
        }

        .science-card {
          padding: var(--spacing-8);
          text-align: center;
        }

        .science-stat {
          margin-bottom: var(--spacing-4);
        }

        .stat-number {
          font-size: var(--font-size-6xl);
          font-weight: var(--font-weight-bold);
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-icon {
          font-size: var(--font-size-6xl);
        }

        .stat-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: var(--spacing-2);
        }

        .science-link {
          display: inline-block;
          margin-top: var(--spacing-4);
          color: var(--color-accent-primary);
          font-weight: var(--font-weight-medium);
        }

        .credibility-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--spacing-4);
        }

        .badge-item {
          padding: var(--spacing-3) var(--spacing-6);
          background: var(--glass-background);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-medium);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-8);
        }

        .testimonial-card {
          padding: var(--spacing-8);
        }

        .testimonial-stars {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-4);
        }

        .testimonial-text {
          font-size: var(--font-size-lg);
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--spacing-6);
          color: var(--color-text-primary);
        }

        .testimonial-author {
          display: flex;
          gap: var(--spacing-3);
          align-items: center;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--gradient-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-bold);
          color: var(--color-background-primary);
        }

        .author-name {
          font-weight: var(--font-weight-semibold);
        }

        .author-role {
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          margin-bottom: var(--spacing-4);
          background: var(--glass-background);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          padding: var(--spacing-5);
          background: none;
          border: none;
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .faq-icon {
          font-size: var(--font-size-2xl);
          transition: transform var(--transition-fast);
        }

        .faq-item.active .faq-icon {
          transform: rotate(45deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height var(--transition-normal);
        }

        .faq-item.active .faq-answer {
          max-height: 500px;
        }

        .faq-answer p {
          padding: 0 var(--spacing-5) var(--spacing-5);
          color: var(--color-text-secondary);
          line-height: var(--line-height-relaxed);
        }

        .cta-section {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 107, 53, 0.1));
          border-top: 1px solid var(--glass-border);
          border-bottom: 1px solid var(--glass-border);
        }

        .cta-content {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: var(--font-size-5xl);
          margin-bottom: var(--spacing-4);
        }

        .cta-subtitle {
          font-size: var(--font-size-xl);
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-8);
        }

        .cta-note {
          margin-top: var(--spacing-3);
          color: var(--color-text-tertiary);
        }

        .footer {
          padding: var(--spacing-16) 0 var(--spacing-8);
          border-top: 1px solid var(--glass-border);
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: var(--spacing-12);
          margin-bottom: var(--spacing-8);
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .footer-tagline {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-8);
        }

        .footer-column h4 {
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: var(--spacing-3);
        }

        .footer-column a {
          display: block;
          margin-bottom: var(--spacing-2);
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }

        .footer-bottom {
          text-align: center;
          padding-top: var(--spacing-8);
          border-top: 1px solid var(--glass-border);
        }

        .footer-bottom p {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }

        @media (max-width: 767px) {
          .nav-links {
            gap: var(--spacing-3);
            font-size: var(--font-size-sm);
          }

          .hero-title {
            font-size: var(--font-size-4xl);
          }

          .use-cases {
            grid-template-columns: 1fr;
          }

          .footer-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default Home;
