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
  const isClickNavigating = useRef(false);
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

    const isMobileDevice = window.innerWidth <= 968;
    const sections = isMobileDevice
      ? ['hero', 'services', 'social-proof', 'contact-form', 'site-footer']
      : ['hero', 'services', 'social-proof', 'partners', 'contact-form', 'site-footer'];

    // Track active section on both mobile and desktop
    sections.forEach(id => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive && !isClickNavigating.current) {
            setActiveSection(id);
          }
        }
      });
    });

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

    let cachedSnapPoints: number[] = [];

    const getSnapPoints = () => {
      if (cachedSnapPoints.length > 0) return cachedSnapPoints;
      const points: number[] = [];
      
      const isMobileDevice = window.innerWidth <= 968;
      const mobileHeader = document.querySelector('[class*="mobileHeader"]');
      const headerHeight = mobileHeader ? mobileHeader.getBoundingClientRect().height : 72;
      const offsetY = isMobileDevice ? headerHeight : 0;

      sections.forEach(id => {
        const anchor = ScrollTrigger.getById(`anchor-${id}`);
        const main = ScrollTrigger.getById(id);
        if (anchor) points.push(Math.max(0, Math.round(anchor.start - offsetY)));
        if (main) {
          if (main.vars.pin) points.push(Math.max(0, Math.round(main.end - offsetY)));
          if (main.vars.snap) {
            const snapVal = typeof main.vars.snap === 'number' ? main.vars.snap : (main.vars.snap as any).snapTo || 0;
            if (snapVal > 0 && snapVal < 1) {
              const steps = Math.round(1 / snapVal);
              const range = main.end - main.start;
              for (let i = 1; i < steps; i++) {
                points.push(Math.max(0, Math.round(main.start + range * (i * snapVal) - offsetY)));
              }
            }
          }
        }
      });
      cachedSnapPoints = [...new Set(points)].sort((a, b) => a - b);
      return cachedSnapPoints;
    };

    const handleRefreshEvent = () => {
      cachedSnapPoints = [];
    };

    ScrollTrigger.addEventListener("refresh", handleRefreshEvent);

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
          onComplete: cleanup,
          onInterrupt: cleanup
        });
      }
    };

    const obs = Observer.create({
      type: "wheel,touch,pointer",
      onDown: (self) => {
        if (Math.abs(self.deltaY) > 20) {
          const isWheel = !self.event || self.event.type.includes('wheel') || self.event.type.includes('mousewheel');
          gotoPoint(isWheel ? 1 : -1);
        }
      },
      onUp: (self) => {
        if (Math.abs(self.deltaY) > 20) {
          const isWheel = !self.event || self.event.type.includes('wheel') || self.event.type.includes('mousewheel');
          gotoPoint(isWheel ? -1 : 1);
        }
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
    });

    document.body.classList.add('is-scroll-hijacked');

    return () => {
      obs.kill();
      ScrollTrigger.removeEventListener("refresh", handleRefreshEvent);
      document.body.classList.remove('is-scroll-hijacked');
    };
  }, [isHome]);

  const scrollTo = (id: string) => {
    if (!isHome) {
      navigate('/', { state: { scrollTo: id } });
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    const { scrolling } = APP_CONFIG;
    const cleanup = () => {
      isNavigating.current = false;
      isClickNavigating.current = false;
      document.body.classList.remove('is-navigating');
      ScrollTrigger.refresh();
    };

    const isMobile = window.innerWidth <= 968;
    const mobileHeader = document.querySelector('[class*="mobileHeader"]');
    const headerHeight = mobileHeader ? mobileHeader.getBoundingClientRect().height : 72;
    const offsetY = isMobile ? headerHeight : 0;

    const anchor = ScrollTrigger.getById(`anchor-${id}`);
    const targetScroll = (!isMobile && anchor) ? anchor.start : `#${id}`;

    gsap.to(window, {
      duration: scrolling.duration,
      scrollTo: {
        y: targetScroll,
        offsetY: offsetY,
        autoKill: scrolling.autoKill
      },
      ease: scrolling.ease,
      overwrite: true,
      onStart: () => {
        isNavigating.current = true;
        isClickNavigating.current = true;
        document.body.classList.add('is-navigating');
        setActiveSection(id);
      },
      onComplete: cleanup,
      onInterrupt: cleanup
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
