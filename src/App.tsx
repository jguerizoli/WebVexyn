import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Hero from './components/sections/Hero';
import Services from './components/sections/Services/Services';
import Results from './components/sections/Results';
import Partners from './components/sections/Partners/Partners';
import Contact from './components/sections/Contact/Contact';
import Footer from './components/layout/Footer/Footer';
import WhatsAppButton from './components/common/WhatsAppButton/WhatsAppButton';
import Error404 from './components/sections/Error404/Error404';
import './App.css';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { APP_CONFIG } from './app.config';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, Observer);

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const isNavigating = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Action 1.1: Global ScrollTrigger Refresh Orchestration
  useEffect(() => {
    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleRefresh);
    window.addEventListener('resize', handleRefresh);

    return () => {
      window.removeEventListener('load', handleRefresh);
      window.removeEventListener('resize', handleRefresh);
    };
  }, []);

  // Action 1.3: Scroll Hijacking & State Orchestration (Only on Home)
  useGSAP(() => {
    if (!isHome) return;

    const sections = ['hero', 'services', 'social-proof', 'partners', 'contact-form', 'site-footer'];
    const isMobile = window.innerWidth < 1024;
    if (isMobile) return;

    let isAnimating = false;

    sections.forEach(id => {
      const anchorId = `anchor-${id}`;
      if (!ScrollTrigger.getById(anchorId)) {
        ScrollTrigger.create({
          id: anchorId,
          trigger: `#${id}`,
          start: "top top",
          refreshPriority: -1
        });
      }
    });

    setTimeout(() => { ScrollTrigger.refresh(); }, 200);

    const getSnapPoints = () => {
      const points: number[] = [];
      sections.forEach(id => {
        const anchor = ScrollTrigger.getById(`anchor-${id}`);
        const main = ScrollTrigger.getById(id);
        if (anchor) points.push(Math.round(anchor.start));
        if (main) {
          if (main.vars.pin) points.push(Math.round(main.end));
          if (main.vars.snap) {
            const snapVal = typeof main.vars.snap === 'number' ? main.vars.snap : (main.vars.snap as any).snapTo || 0;
            if (snapVal > 0 && snapVal < 1) {
              const steps = Math.round(1 / snapVal);
              const range = main.end - main.start;
              for (let i = 1; i < steps; i++) {
                points.push(Math.round(main.start + range * (i * snapVal)));
              }
            }
          }
        }
      });
      return [...new Set(points)].sort((a, b) => a - b);
    };

    const gotoPoint = (direction: number) => {
      if (isAnimating || isNavigating.current) return;
      const points = getSnapPoints();
      const currentScroll = Math.round(window.scrollY);
      let target;
      if (direction > 0) {
        target = points.find(p => p > currentScroll + 20); 
      } else {
        target = [...points].reverse().find(p => p < currentScroll - 20);
      }
      if (target !== undefined) {
        isAnimating = true;
        isNavigating.current = true;
        document.body.classList.add('is-navigating');
        const cleanup = () => {
          isAnimating = false; 
          isNavigating.current = false;
          document.body.classList.remove('is-navigating');
          ScrollTrigger.update();
        };
        gsap.to(window, {
          scrollTo: target,
          duration: 1.15, 
          ease: "expo.out", 
          overwrite: true,
          onUpdate: () => ScrollTrigger.update(),
          onComplete: cleanup,
          onInterrupt: cleanup,
          onOverwrite: cleanup
        });
      }
    };

    const obs = Observer.create({
      type: "wheel,touch,pointer",
      onDown: (self) => {
        if (Math.abs(self.deltaY) > 20) gotoPoint(1);
      },
      onUp: (self) => {
        if (Math.abs(self.deltaY) > 20) gotoPoint(-1);
      },
      tolerance: 25
    });

    sections.forEach(id => {
      if (!ScrollTrigger.getById(id)) {
        ScrollTrigger.create({
          id: id,
          trigger: `#${id}`,
          start: "top top"
        });
      }
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive && !isNavigating.current) {
            setActiveSection(id);
          }
        }
      });
    });

    document.body.classList.add('is-desktop-hijack');

    return () => {
      obs.kill();
      document.body.classList.remove('is-desktop-hijack');
    };
  }, [isHome]);

  const scrollTo = (id: string) => {
    if (!isHome) {
      navigate('/', { state: { scrollTo: id } });
      return;
    }

    ScrollTrigger.refresh();
    const element = document.getElementById(id);
    if (!element) return;

    const { scrolling } = APP_CONFIG;
    const cleanup = () => {
      isNavigating.current = false;
      document.body.classList.remove('is-navigating');
      ScrollTrigger.refresh();
    };

    gsap.to(window, {
      duration: scrolling.duration,
      scrollTo: {
        y: `#${id}`,
        autoKill: scrolling.autoKill
      },
      ease: scrolling.ease,
      overwrite: true,
      onStart: () => {
        isNavigating.current = true;
        document.body.classList.add('is-navigating');
        setActiveSection(id);
      },
      onUpdate: () => ScrollTrigger.update(),
      onComplete: cleanup,
      onInterrupt: cleanup,
      onOverwrite: cleanup
    });
  };

  // Handle cross-page scrolling
  useEffect(() => {
    if (isHome && location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      // Small delay to ensure DOM is ready
      setTimeout(() => scrollTo(targetId), 100);
      // Clear state so it doesn't scroll again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [isHome, location.state]);

  return (
    <div className="app-container">
      <WhatsAppButton />
      <Sidebar activeSection={activeSection} scrollTo={scrollTo} />
      <main className="content">
        <Routes>
          <Route path="/" element={
            <>
              <Hero scrollTo={scrollTo} />
              <Services scrollTo={scrollTo} />
              <Results scrollTo={scrollTo} />
              <Partners />
              <Contact />
              <Footer id="site-footer" scrollTo={scrollTo} />
            </>
          } />
          <Route path="*" element={
            <>
              <Error404 />
              <Footer id="site-footer" scrollTo={scrollTo} />
            </>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
