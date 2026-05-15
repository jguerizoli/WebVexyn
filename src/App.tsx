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

    // Create Master Anchor Triggers for each section (top top)
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

    // Refresh to ensure offsets are perfect
    setTimeout(() => { ScrollTrigger.refresh(); }, 200);

    const getSnapPoints = () => {
      const points: number[] = [];

      sections.forEach(id => {
        const anchor = ScrollTrigger.getById(`anchor-${id}`);
        const main = ScrollTrigger.getById(id);

        if (anchor) {
          points.push(Math.round(anchor.start));
        }

        if (main) {
          // If the main trigger is pinned, the end of the pin is a valid state
          if (main.vars.pin) {
            points.push(Math.round(main.end));
          }

          // If section has internal snap (Services/Results), add those points too
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

      const uniqueSorted = [...new Set(points)].sort((a, b) => a - b);
      return uniqueSorted;
    };

    const gotoPoint = (direction: number) => {
      if (isAnimating || isNavigating.current) return;

      const points = getSnapPoints();
      const currentScroll = Math.round(window.scrollY);
      
      let target;
      if (direction > 0) {
        // Look for next point with a slightly larger margin to avoid micro-jitter
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
      // Removed wheelSpeed: -1 to keep natural direction
      onDown: (self) => {
        // onDown in Observer = user scrolls DOWN / swipes UP
        if (Math.abs(self.deltaY) > 20) gotoPoint(1);
      },
      onUp: (self) => {
        // onUp in Observer = user scrolls UP / swipes DOWN
        if (Math.abs(self.deltaY) > 20) gotoPoint(-1);
      },
      tolerance: 25
      // preventDefault removed to allow click/touch events to bubble to the UI
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

    document.body.classList.add('is-desktop-hijack');

    return () => {
      obs.kill();
      document.body.classList.remove('is-desktop-hijack');
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
