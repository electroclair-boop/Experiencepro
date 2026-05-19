import { useEffect, useState, useRef, lazy, Suspense } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import iboProLogo from './assets/IBOPRO.webp'
import smartersLogo from './assets/SMARTERS PRO.webp'
import smartOneLogo from './assets/SMARTONE.webp'
import setIptvLogo from './assets/SET IPTV.webp'
import netIptvLogo from './assets/NET IPTV.webp'
import iboPlayerLogo from './assets/IBOPLAYER.webp'
import bayTvLogo from './assets/BAY TV.webp'
import bobPlayerLogo from './assets/BOB PLAYER.webp'
import elkPlayerLogo from './assets/ELK PLAYER.webp'
import smartIptvLogo from './assets/SMART IPTV.webp'
import { translations } from './translations'

// Lazy loading components
const Blog = lazy(() => import('./pages/Blog'))
const Contact = lazy(() => import('./pages/Contact'))

const Counter = ({ target, duration = 2000, prefix = "", suffix = "" }: { target: number, duration?: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const end = target;
    const totalFrames = Math.round(duration / 16);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.round(end * easeProgress);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentCount);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return <span ref={nodeRef}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

interface Plan {
  id: number;
  name: string;
  price: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

function Home() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [showCookie, setShowCookie] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const { hash } = useLocation();

  const t = translations[lang as keyof typeof translations];

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) setShowCookie(true);

    const checkScroll = () => {
      setShowScroll(window.pageYOffset > 400);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
      }
    }
  }, [hash]);

  useEffect(() => {
    document.documentElement.lang = lang;
    
    // SEO & Meta Tags
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://www.iptv-experiencepro.com');
    if (!document.head.contains(canonical)) document.head.appendChild(canonical);

    document.title = lang === 'fr' ? "Experience Pro IPTV - Meilleur Abonnement 2026" : "Experience Pro IPTV - Best 2026 Subscription";

    const targetDate = new Date('June 11, 2026 20:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    const API_URL = import.meta.env.MODE === 'development' 
      ? 'http://localhost:5000' 
      : window.location.origin;
    fetch(`${API_URL}/api/plans`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        setPlans(data);
        setError(null);
      })
      .catch(err => {
        console.error('Erreur lors du chargement des plans:', err);
        setError(lang === 'fr' ? 'Impossible de charger les offres.' : 'Unable to load offers.');
      });
  }, [lang]);

  return (
    <div className="home-view">
      {showCookie && (
        <div className="cookie-banner">
          <p>{t.cookie}</p>
          <button className="btn btn-primary" onClick={() => { setShowCookie(false); localStorage.setItem('cookie-consent', 'true'); }}>{t.accept}</button>
        </div>
      )}
      <div className="top-bar">
        {lang === 'fr' ? '🔥 OFFRE SPÉCIALE : -50% SUR TOUS LES ABONNEMENTS JUSQU\'À CE SOIR !' : '🔥 SPECIAL OFFER: 50% OFF ALL SUBSCRIPTIONS UNTIL TONIGHT!'}
      </div>
      <nav className="navbar container">
        <div className="brand-section" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="logo-container">
            <img 
              src="/logo.webp" 
              alt="Logo IPTV-EXPERIENCEPRO" 
              className="navbar-logo-img" 
              width="45" 
              height="45" 
              fetchPriority="high"
            />
          </div>
          <div className="logo-text">IPTV<span>-EXPERIENCEPRO</span></div>
        </div>
        
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>{t.status}</span>
          </div>
          <Link to="/" onClick={() => setMenuOpen(false)}>{lang === 'fr' ? 'Accueil' : 'Home'}</Link>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>{t.pricing}</a>
          <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <button className="lang-switch" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
            {lang === 'fr' ? '🇺🇸 EN' : '🇫🇷 FR'}
          </button>
        </div>

        <div className="nav-right">
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      <button className={`back-to-top ${showScroll ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </button>

      <header className="hero">
        <div className="hero-content">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroSub}</p>
          <div className="hero-btns" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase' }}
            >
              🚀 {t.order} {lang === 'fr' ? 'MAINTENANT' : 'NOW'}
            </button>
          </div>
        </div>
      </header>

      <a 
        href="https://wa.me/212648906529" 
        className="whatsapp-float cyber-wa" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: '30px', right: '30px', background: 'linear-gradient(135deg, #00ff88 0%, #00d2ff 100%)',
          width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '30px', boxShadow: '0 0 25px rgba(0, 255, 136, 0.5)', zIndex: 1000, textDecoration: 'none', animation: 'pulse-glow 2s infinite'
        }}
      >
        <span className="wa-bubble">{lang === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}</span>
        <svg viewBox="0 0 448 512" width="30" height="30" fill="#000">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.9-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>

      <section id="features" className="section container">
        <h2 className="section-title">{t.heroTitle1}</h2>
        <div className="features-grid">
          {[
            { icon: "📱", title: t.unlimitedContent, desc: t.unlimitedContentDesc, color: "#00ff37" },
            { icon: "⚽", title: t.liveSports, desc: t.liveSportsDesc, color: "#00d2ff" },
            { icon: "🔥", title: t.trendingSeries, desc: t.trendingSeriesDesc, color: "#ff00ff" },
            { icon: "⏪", title: lang === 'fr' ? "Replay 14 Jours" : "14 Days Replay", desc: lang === 'fr' ? "Ne manquez plus rien !" : "Never miss a thing!", color: "#fbba00" },
            { icon: "📱💻", title: lang === 'fr' ? "Multi-appareils" : "Multi-device", desc: lang === 'fr' ? "Connectez-vous partout." : "Connect everywhere.", color: "#ff4444" },
            { icon: "📅", title: lang === 'fr' ? "Guide EPG" : "EPG Guide", desc: lang === 'fr' ? "Programmes complets." : "Full TV guide.", color: "#00ff88" }
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', border: `2px solid ${f.color}`, borderRadius: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ color: f.color }}>{f.title}</h3>
              <p style={{ fontWeight: '600' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="channels-marquee-section">
        <div className="container">
          <div className="marquee-header">
            <div className="title-line"></div>
            <h2 className="section-title marquee-title">
              {lang === 'fr' ? 'NOS MEILLEURES CHAÎNES' : 'OUR BEST CHANNELS'}
            </h2>
            <div className="title-line"></div>
          </div>
        </div>
        <div className="marquee-container marquee-reverse">
          <div className="marquee-track">
            {[
              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Canal%2B_Sport_logo_2021.svg/512px-Canal%2B_Sport_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Canal%2B_Cin%C3%A9ma_logo_2021.svg/512px-Canal%2B_Cin%C3%A9ma_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Canal%2B_Foot_logo_2022.svg/512px-Canal%2B_Foot_logo_2022.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Canal%2B_S%C3%A9ries_logo_2021.svg/512px-Canal%2B_S%C3%A9ries_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Canal%2B_Docs_logo_2021.svg/512px-Canal%2B_Docs_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Canal%2B_Kids_logo_2021.svg/512px-Canal%2B_Kids_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/BeIN_Sports_1_logo.svg/512px-BeIN_Sports_1_logo.svg.png"
            ].map((url, i) => (
              <div key={i} className="marquee-item">
                <img src={url} alt="Channel" loading="lazy" width="120" height="60" style={{ objectFit: 'contain' }} />
              </div>
            ))}
            {/* Duplication pour boucle infinie */}
            {[
              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Canal%2B_Sport_logo_2021.svg/512px-Canal%2B_Sport_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Canal%2B_Cin%C3%A9ma_logo_2021.svg/512px-Canal%2B_Cin%C3%A9ma_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Canal%2B_Foot_logo_2022.svg/512px-Canal%2B_Foot_logo_2022.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Canal%2B_S%C3%A9ries_logo_2021.svg/512px-Canal%2B_S%C3%A9ries_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Canal%2B_Docs_logo_2021.svg/512px-Canal%2B_Docs_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Canal%2B_Kids_logo_2021.svg/512px-Canal%2B_Kids_logo_2021.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/BeIN_Sports_1_logo.svg/512px-BeIN_Sports_1_logo.svg.png"
            ].map((url, i) => (
              <div key={`dup-${i}`} className="marquee-item">
                <img src={url} alt="Channel" loading="lazy" width="120" height="60" style={{ objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="world-cup-section" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center', padding: '4rem 0', textAlign: 'center'
      }}>
        <div className="container">
          <h2 className="section-title" style={{ border: 'none' }}>🏆 {t.worldCup}</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto 2rem auto' }}>{t.worldCupDesc}</p>
          <div className="countdown-container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', margin: '2rem 0' }}>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.days}</div>
              <div className="countdown-label">{t.days}</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.hours}</div>
              <div className="countdown-label">{t.hours}</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.minutes}</div>
              <div className="countdown-label">{t.min}</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.seconds}</div>
              <div className="countdown-label">{t.sec}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="section container">
        <h2 className="section-title">{t.ourPlans}</h2>
        <div className="pricing-grid">
          {plans.length === 0 && !error ? (
            [1,2,3,4].map(i => <div key={i} className="skeleton-card"></div>)
          ) : error ? (
            <div className="error-message" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>Réessayer</button>
            </div>
          ) : (
            plans.map(plan => (
              <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <span className="badge">{lang === 'fr' ? 'Populaire' : 'Popular'}</span>}
                <h3>{plan.name}</h3>
                <div className="price">{plan.price}</div>
                <div className="duration">{plan.duration}</div>
                <ul className="features-list">
                  {plan.features.map((feature, index) => (
                    <li key={index}>✅ {feature}</li>
                  ))}
                </ul>
                <a href={`https://wa.me/212648906529?text=Order: ${plan.name}`} className="btn btn-pricing">{t.order}</a>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <h2 className="section-title">{t.subscribe}</h2>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={t.emailPlaceholder} style={{ flex: 1, padding: '1rem', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} />
            <button className="btn btn-primary">OK</button>
          </form>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">{t.whyUs}</h2>
        <div className="features-grid">
          <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid #00d2ff', borderRadius: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌐</div>
            <h3 style={{ color: '#00d2ff' }}><Counter target={20000} prefix="+" /> {lang === 'fr' ? 'Chaînes' : 'Channels'}</h3>
            <p>{t.channels10kDesc}</p>
          </div>
          <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', border: `2px solid #ff00ff`, borderRadius: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
            <h3 style={{ color: '#ff00ff' }}>{t.quality4kUhd}</h3>
            <p>{t.quality4kUhdDesc}</p>
          </div>
          <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', border: `2px solid #00ff88`, borderRadius: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎧</div>
            <h3 style={{ color: '#00ff88' }}>{t.support247}</h3>
            <p>{t.support247Desc}</p>
          </div>
        </div>
      </section>

      <section className="section container testimonials-section">
        <h2 className="section-title">{t.testimonials}</h2>
        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { name: "Jean-Pierre D.", city: "France", text: "Best service I've ever tested.", rating: 5 },
            { name: "Marc L.", city: "Belgium", text: "Fast support, great quality.", rating: 5 },
            { name: "Karim M.", city: "Morocco", text: "Premium quality during World Cup.", rating: 5 }
          ].map((item, i) => (
            <div key={i} className="testimonial-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '25px', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
              <div className="rating" style={{ color: '#fbba00', marginBottom: '1rem' }}>{"★".repeat(item.rating)}</div>
              <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{item.text}"</p>
              <strong>{item.name}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="section container" style={{ background: 'var(--surface)' }}>
        <h2 className="section-title">{t.faq}</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {[
            { q: t.howToInstall, a: t.howToInstallDesc },
            { q: t.multipleDevices, a: t.multipleDevicesDesc }
          ].map((item, index) => (
            <div key={index} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#00d2ff' }}>{item.q}</h3>
              <p style={{ opacity: 0.9 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ display: 'none' }}>
        <img src={iboProLogo} alt="IBO" /><img src={smartersLogo} alt="Smarters" />
        <img src={smartOneLogo} alt="One" /><img src={setIptvLogo} alt="Set" />
        <img src={netIptvLogo} alt="Net" /><img src={iboPlayerLogo} alt="IboPlayer" />
        <img src={bayTvLogo} alt="Bay" /><img src={bobPlayerLogo} alt="Bob" />
        <img src={elkPlayerLogo} alt="Elk" /><img src={smartIptvLogo} alt="Smart" />
      </footer>

      <footer>
        <div className="container">
          <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div className="footer-section">
              <h4>IPTV-EXPERIENCEPRO</h4>
              <p>{t.refStreaming}</p>
            </div>
            <div className="footer-section">
              <h4>{t.quickLinks}</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link to="/">{lang === 'fr' ? 'Accueil' : 'Home'}</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          <p style={{ borderTop: '1px solid #444', paddingTop: '1.5rem', opacity: 0.6 }}>&copy; 2026 IPTV-EXPERIENCEPRO. {t.rights}</p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <div className="app">
      <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
