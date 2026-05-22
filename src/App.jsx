import React, { useEffect, useRef, useState } from 'react';
import backgroundVideo from '../backgroundvideo.mp4';
import portfolioVideo from './assets/portfoliovideo.mp4';
import resumeVideo from './assets/resumevideo.mp4';
import contactVideo from './assets/contact.mp4';

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`;

const profilePhoto = publicAsset('portrait.png');
const resumePdf = publicAsset('resume.pdf');

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

const projects = [
  {
    title: 'Dream Maker',
    stack: 'React / Node.js / SQLite',
    description:
      'Full-stack AI image generation app that turns dream descriptions into visuals with secure API routing, daily usage limits, and persistent user tracking.',
    href: 'https://dream-maker-1.onrender.com/',
    image: publicAsset('DreamMaker.png'),
  },
  {
    title: 'Revibe AI (Hackathon Winner)',
    stack: 'Express.js / TailwindCSS / SerpAPI / Gemini ',
    description:
      'Award-winning AI design platform that transforms room photos into personalized redesigns with structured furniture recommendations.',
    href: 'https://devpost.com/software/revibe-ai',
    image: publicAsset('Revibe.png'),
  },
  {
    title: "Scholar's Companion",
    stack: 'Flask / Google Search API / Bootstrap / C++ ',
    description:
      'Ranks Google articles by reading difficulty using web scraping and a readability-scoring algorithm to match students with accessible resources.',
    href: 'https://scholarscompanion.com/',
    image: publicAsset('scholars.png'),
  },
];

const skills = [
  { name: 'Java',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
  { name: 'Python',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  { name: 'C/C++',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'React',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Node.js',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'Express',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', mono: true },
  { name: 'Flask',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg', mono: true },
  { name: 'SQL',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
  { name: 'Git',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
];

// Maps tab → which track panel to show (contact shares about's panel)
const SEC_INDEX = { about: 0, projects: 1, resume: 2, contact: 3 };

function getThemeMode(tabId) {
  if (tabId === 'projects') return 'portfolio';
  if (tabId === 'resume')   return 'resume';
  if (tabId === 'contact')  return 'contact';
  return 'main';
}

function App() {
  const [activeTab, setActiveTab] = useState('about');

  const selectSection = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
  };

  const currentMode = getThemeMode(activeTab);
  const trackOffset = -SEC_INDEX[activeTab] * 100;

  return (
    <main
      className={`portfolio-shell theme-${currentMode}`}
      data-background={currentMode}
    >
      {/* ── Video track ─────────────────────────────────────────────────── */}
      <div id="stage">
        <div id="video-track" style={{ transform: `translateX(${trackOffset}vw)` }}>
          <div className="video-panel" id="panel-about">
            <video autoPlay loop muted playsInline preload="auto">
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          </div>
          <div className="video-panel" id="panel-projects">
            <video autoPlay loop muted playsInline preload="auto">
              <source src={portfolioVideo} type="video/mp4" />
            </video>
          </div>
          <div className="video-panel" id="panel-resume">
            <video autoPlay loop muted playsInline preload="auto">
              <source src={resumeVideo} type="video/mp4" />
            </video>
          </div>
          <div className="video-panel" id="panel-contact">
            <video autoPlay loop muted playsInline preload="auto">
              <source src={contactVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* ── Shade overlays (cross-fade via opacity) ──────────────────────── */}
      <div className="video-shade shade-main" />
      <div className="video-shade shade-portfolio" />
      <div className="video-shade shade-resume" />
      <div className="video-shade shade-contact" />
      <div className="pixel-grid" />

      {/* ── Static header ────────────────────────────────────────────────── */}
      <div id="hud-stage">
        <Hud
          activeTab={activeTab}
          className={`top-hud theme-${currentMode}`}
          onSelectSection={selectSection}
        />
      </div>

      {/* ── Content track — slides in sync with the video ────────────────── */}
      <div
        id="content-track"
        style={{ transform: `translateX(${trackOffset}vw)` }}
        data-active={SEC_INDEX[activeTab]}
      >
        <div className="track-panel">
          <section className="scene theme-main" aria-live="polite">
            <AboutPanel onSelectSection={selectSection} />
          </section>
        </div>
        <div className="track-panel">
          <section className="scene theme-portfolio" aria-live="polite">
            <ProjectsPanel />
          </section>
        </div>
        <div className="track-panel">
          <section className="scene theme-resume" aria-live="polite">
            <ResumePanel />
          </section>
        </div>
        <div className="track-panel">
          <section className="scene theme-contact" aria-live="polite">
            <ContactPanel />
          </section>
        </div>
      </div>

      <RetroCursor />
    </main>
  );
}

function RetroCursor() {
  const ref = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    const onOver = (e) => {
      setHovering(!!e.target.closest('a, button'));
    };
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <div ref={ref} className={`retro-cursor${hovering ? ' is-hovering' : ''}`} aria-hidden="true">
      <span className="pixel-cursor" />
    </div>
  );
}


function Hud({ activeTab, className, onSelectSection }) {
  return (
    <header className={className}>
      <span className="hud-bg-layer" aria-hidden="true" />
      <span className="hud-bg-layer-contact" aria-hidden="true" />
      <button
        className="brand-mark"
        onClick={() => onSelectSection('projects')}
        type="button"
      >
        Basem.Portfolio
      </button>

      <nav className="hud-tabs" aria-label="Portfolio sections">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? 'hud-tab active' : 'hud-tab'}
            key={tab.id}
            onClick={() => onSelectSection(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function PhotoSlot() {
  return (
    <figure className="photo-slot">
      {profilePhoto ? (
        <img alt="Your profile" src={profilePhoto} />
      ) : (
        <div className="photo-placeholder" aria-label="Profile photo placeholder">
          <span className="pixel-head" />
          <span className="pixel-body" />
          <strong>[ Your Photo Here ]</strong>
        </div>
      )}
    </figure>
  );
}

function AboutPanel({ onSelectSection }) {
  return (
    <div className="about-layout">
      <PhotoSlot />

      <article className="hero-copy">
        <p className="role-tag">Software Developer</p>
        <h1>
          <span>Hello, I&apos;m</span>
          <span>Basem Mohamed</span>
        </h1>
        <p className="terminal-line">software engineering student graduating 2027</p>
        <p className="intro-copy">
          I build clean, reliable software with a focus on practical problem-solving, intuitive design, and strong user experience. My goal is to create applications that feel simple, useful, and carefully built.
        </p>

        <div className="hero-actions">
          <button
            className="pixel-button primary"
            onClick={() => onSelectSection('projects')}
            type="button"
          >
            View Projects
          </button>
          <a className="pixel-button secondary" href={resumePdf}>
            Get Resume
          </a>
        </div>
      </article>
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="stacked-panel projects-panel">
      <div className="section-heading">
        <p className="role-tag">Project Select</p>
        <h2>My projects</h2>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <a
              className="project-art"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title}`}
            >
              <img src={project.image} alt={project.title} />
            </a>
            <div className="project-copy">
              <p>{project.stack}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ResumePanel() {
  return (
    <div className="stacked-panel resume-panel">
      <article className="resume-intro">
        <p className="role-tag">Resume File</p>
        <h2>Experience and skills</h2>
        <p>
I’m a Computer Science student focused on full-stack development, API integration, and user-centered software. Through projects and freelance work, I’ve built applications involving AI tools, backend services, databases, web scraping, and responsive interfaces.
        </p>
        <a className="pixel-button primary" href={resumePdf}>
          Open Resume PDF
        </a>
      </article>

      <div className="resume-right">
        <div className="resume-preview">
          <iframe src={`${resumePdf}#toolbar=0&navpanes=0&scrollbar=0`} title="Resume preview" />
        </div>

        <section className="skill-cloud" aria-label="Technical skills">
          {skills.map((skill) => (
            <span key={skill.name}>
              <img src={skill.icon} alt={skill.name} className={skill.mono ? 'mono' : ''} />
              {skill.name}
            </span>
          ))}
        </section>
      </div>
    </div>
  );
}

function ContactPanel() {
  return (
    <div className="stacked-panel contact-panel">
      <p className="role-tag">Contact</p>
      <h2>Let&apos;s build something.</h2>
      <p>
        I’m open to software development opportunities, technical collaborations, and projects where I can help build clean and reliable applications.
      </p>
      <div className="contact-links">
        <a href="mailto:basemmohamedgad1@gmail.com">Email</a>
        <a href="https://github.com/basemgad" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/basemgad" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    </div>
  );
}

export default App;
