import React from "react";
import { Link, useNavigate } from "react-router-dom";

const features = [
  {
    icon: "🧠",
    title: "AI-Powered Assessment",
    text: "Get personalized questions designed to understand your interests, strengths and work preferences.",
  },
  {
    icon: "🎯",
    title: "Career Direction",
    text: "Turn your assessment responses into clear career areas and practical next steps.",
  },
  {
    icon: "📊",
    title: "Personalized Results",
    text: "View your score and understand which career areas match your responses.",
  },
  {
    icon: "💬",
    title: "Smart Guidance",
    text: "Use AI-based guidance to explore skills, roles and learning opportunities.",
  },
];

const steps = [
  {
    no: "01",
    icon: "👤",
    title: "Create Your Account",
    text: "Register securely and start your Career Compass journey.",
  },
  {
    no: "02",
    icon: "📝",
    title: "Take the Assessment",
    text: "Answer questions honestly about your interests, skills and preferences.",
  },
  {
    no: "03",
    icon: "🧭",
    title: "Discover Your Direction",
    text: "Review your score and explore career areas suggested from your responses.",
  },
];

const careers = [
  ["💻", "Technology", "Software, Web Development, Data & AI"],
  ["🎨", "Design", "UI/UX, Graphics & Creative Technology"],
  ["📈", "Business", "Management, Marketing & Entrepreneurship"],
  ["🔬", "Science", "Research, Analysis & Scientific Careers"],
  ["🩺", "Healthcare", "Health, Life Science & Support Roles"],
  ["🗣️", "Communication", "Media, Content, Public Relations & More"],
];

function Home() {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("currentUser");

  const logout = () => {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("quizResult");
    navigate("/");
  };

  return (
    <div className="home-page">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar home-navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">🧭</span>
          Career Compass
        </Link>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#careers">Careers</a>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/quiz" className="nav-btn">
                Take Quiz
              </Link>
              <button className="nav-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn">
                Login
              </Link>
              <Link to="/register" className="primary-btn small">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="home-main">
        {/* ================= HERO SECTION ================= */}
        <section className="hero-section">
          <div className="hero-glow glow-one"></div>
          <div className="hero-glow glow-two"></div>

          <div className="hero-content">
            <div className="eyebrow">
              <span>✦</span>
              AI-POWERED CAREER GUIDANCE
            </div>

            <h1>
              Discover a career path that feels <span>right for you.</span>
            </h1>

            <p className="hero-description">
              Career Compass helps students understand their interests,
              strengths and preferences through an AI-powered career assessment.
            </p>

            <div className="hero-buttons">
              <Link
                to={user ? "/quiz" : "/register"}
                className="primary-btn hero-btn"
              >
                Start Career Assessment
                <span>→</span>
              </Link>

              <a href="#about" className="secondary-btn hero-btn">
                Explore Career Compass
              </a>
            </div>

            <div className="trust-row">
              <span>✓ Personalized assessment</span>
              <span>✓ Student-friendly</span>
              <span>✓ AI-assisted guidance</span>
            </div>
          </div>

          {/* ================= HERO VISUAL WITH REVOLVING BUBBLES ================= */}
          <div className="hero-visual">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            {/* Revolving Orbit Tracks */}
            <div className="orbit-track track-one">
              <div className="floating-card floating-bubble">
                <span className="bubble-icon">✨</span>
                <div className="bubble-text">
                  <strong>Personalized</strong>
                  <small>for your profile</small>
                </div>
              </div>
            </div>

            <div className="orbit-track track-two">
              <div className="floating-card floating-bubble">
                <span className="bubble-icon">🎯</span>
                <div className="bubble-text">
                  <strong>Career Focus</strong>
                  <small>discover your strengths</small>
                </div>
              </div>
            </div>

            {/* Central Compass Card */}
            <div className="compass-card">
              <div className="compass-top">
                <span className="tiny-label">YOUR CAREER JOURNEY</span>
                <span className="live-dot">● AI</span>
              </div>

              <div className="compass-symbol">🧭</div>

              <h3>Find Your Direction</h3>
              <p>Assessment → Analysis → Career Discovery</p>

              <div className="journey-line">
                <span className="active-step">1</span>
                <i></i>
                <span>2</span>
                <i></i>
                <span>3</span>
              </div>

              <div className="compass-bottom">
                <div>
                  <strong>20</strong>
                  <small>Questions</small>
                </div>
                <div>
                  <strong>AI</strong>
                  <small>Analysis</small>
                </div>
                <div>
                  <strong>∞</strong>
                  <small>Possibilities</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT SECTION ================= */}
        <section id="about" className="about-section section">
          <div className="section-heading">
            <span className="section-tag">ABOUT CAREER COMPASS</span>
            <h2>
              Your journey starts with <span>self-discovery.</span>
            </h2>
            <p>
              Choosing a career can be confusing. Career Compass gives students
              a simple digital platform to assess themselves and explore career
              directions.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-box" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="how-it-works" className="steps-section section">
          <div className="section-heading center-heading">
            <span className="section-tag">HOW IT WORKS</span>
            <h2>
              Three simple steps to <span>your direction.</span>
            </h2>
            <p>
              No complicated process. Just answer, understand and explore.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-box" key={step.no}>
                <div className="step-number">{step.no}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ================= CAREER AREAS ================= */}
        <section id="careers" className="career-section section">
          <div className="section-heading center-heading">
            <span className="section-tag">EXPLORE POSSIBILITIES</span>
            <h2>
              Many paths. <span>One direction.</span>
            </h2>
            <p>
              Explore broad career areas and identify the ones that connect with
              your interests.
            </p>
          </div>

          <div className="career-grid">
            {careers.map(([icon, title, text]) => (
              <div className="career-card" key={title}>
                <span className="career-icon">{icon}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <span className="arrow">↗</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="cta-section">
          <div className="cta-inner">
            <div>
              <span className="section-tag light-tag">READY TO BEGIN?</span>
              <h2>Your future starts with understanding yourself.</h2>
              <p>
                Take the Career Compass assessment and start exploring your
                possibilities.
              </p>
            </div>

            <Link
              to={user ? "/quiz" : "/register"}
              className="cta-button"
            >
              Start Assessment
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-brand">
          <Link className="brand" to="/">
            <span className="brand-icon">🧭</span>
            Career Compass
          </Link>
          <p>AI-assisted career discovery for students.</p>
        </div>

        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#careers">Career Areas</a>
          <Link to="/quiz">Assessment</Link>
        </div>

        <div className="copyright">
          © 2026 Career Compass. Built for student career discovery.
        </div>
      </footer>
    </div>
  );
}

export default Home;