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
import { APP_CONFIG } from './app.config';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

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

  // Action 1.3: Scroll-Synchronized Navigation Tracking
  useGSAP(() => {
    const sections = ['hero', 'services', 'social-proof', 'partners', 'contact-form'];
    
    sections.forEach(id => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 40%", // Trigger when section is near top/middle
        end: "bottom 40%",
        onToggle: (self) => {
          // Only update if we're NOT in a programmatic scroll
          if (self.isActive && !isNavigating.current) {
            setActiveSection(id);
          }
        }
      });
    });
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
