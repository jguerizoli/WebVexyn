import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/layout/Sidebar';
import Hero from './components/sections/Hero';
import Services from './components/sections/Services/Services';
import Results from './components/sections/Results';
import Partners from './components/sections/Partners/Partners';
import Contact from './components/sections/Contact/Contact';
import LanguageSwitcher from './components/common/LanguageSwitcher/LanguageSwitcher';
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

  // Action 1.3: Scroll Hijacking & State Orchestration
  useGSAP(() => {
    const sections = ['hero', 'services', 'social-proof', 'partners', 'contact-form'];
    const isMobile = window.innerWidth < 1024;
    if (isMobile) return; // Keep native scroll on mobile for better accessibility

    let isAnimating = false;

    // Refresh everything to ensure offsets are perfect
    setTimeout(() => { ScrollTrigger.refresh(); }, 200);

    const getSnapPoints = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const points: number[] = [];
      
      sections.forEach(id => {
        const st = ScrollTrigger.getById(id);
        if (st) {
          points.push(st.start);
          // If section has internal snap (Services/Results), add those points too
          if (st.vars.snap) {
            const snapVal = typeof st.vars.snap === 'number' ? st.vars.snap : (st.vars.snap as any).snapTo || 0;
            if (snapVal > 0 && snapVal < 1) {
              const steps = Math.round(1 / snapVal);
              for (let i = 1; i < steps; i++) {
                points.push(st.start + (st.end - st.start) * (i * snapVal));
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
      const currentScroll = window.scrollY;
      
      // Find where we are in the state list
      let target;
      if (direction > 0) {
        target = points.find(p => p > currentScroll + 5); // +5 to avoid rounding issues
      } else {
        target = [...points].reverse().find(p => p < currentScroll - 5);
      }

      if (target !== undefined) {
        isAnimating = true;
        gsap.to(window, {
          scrollTo: target,
          duration: 1,
          ease: "power3.inOut",
          onStart: () => { isNavigating.current = true; },
          onComplete: () => { 
            isAnimating = false; 
            isNavigating.current = false;
            ScrollTrigger.update();
          }
        });
      }
    };

    const obs = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => gotoPoint(1),
      onUp: () => gotoPoint(-1),
      tolerance: 10,
      preventDefault: true
    });

    // Ensure all 5 sections have a main trigger for anchoring
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

    ScrollTrigger.normalizeScroll(true);

    return () => {
      obs.kill();
      ScrollTrigger.normalizeScroll(false);
    };
  }, []);

  const scrollTo = (id: string) => {
    // Action 1.4: Pre-navigation refresh to ensure pinned offsets are accurate
    ScrollTrigger.refresh();
    
    const element = document.getElementById(id);
    if (!element) return;

    const { scrolling } = APP_CONFIG;
    
    // Action 1.2 Refined: Robust cleanup to prevent stuck 'is-navigating' states
    // and ensure ScrollTrigger recalibrates after each navigation
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
      overwrite: true, // Kill existing tweens to avoid state conflicts
      onStart: () => {
        isNavigating.current = true;
        document.body.classList.add('is-navigating');
        setActiveSection(id); // Immediate Sidebar feedback
      },
      onUpdate: () => {
        // Keep ScrollTriggers in sync during high-speed travel
        ScrollTrigger.update();
      },
      onComplete: cleanup,
      onInterrupt: cleanup,
      onOverwrite: cleanup
    });
  };

  return (
    <div className="app-container">
      <LanguageSwitcher />
      <Sidebar activeSection={activeSection} scrollTo={scrollTo} />
      <main className="content">
        <Hero scrollTo={scrollTo} />
        <Services scrollTo={scrollTo} />
        <Results scrollTo={scrollTo} />
        <Partners />
        <Contact />
      </main>
    </div>
  );
}

export default App;
