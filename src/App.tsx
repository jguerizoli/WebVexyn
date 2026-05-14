import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Hero from './components/sections/Hero';
import Services from './components/sections/Services/Services';
import Results from './components/sections/Results';
import './App.css';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

function App() {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Clean Jump: Fade out content that shouldn't be 'scrubbed' during teleportation
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, autoKill: true },
        ease: 'power4.inOut',
        onStart: () => document.body.classList.add('is-navigating'),
        onComplete: () => {
          document.body.classList.remove('is-navigating');
          setActiveSection(id);
        }
      });
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeSection={activeSection} scrollTo={scrollTo} />
      <main className="content">
        <Hero scrollTo={scrollTo} />
        <Services scrollTo={scrollTo} />
        <Results scrollTo={scrollTo} />
        <section id="partners" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--respiro-v-lg) var(--respiro-h)' }}>
          <h1>Partners Section</h1>
        </section>
        <section id="contact-form" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--respiro-v-lg) var(--respiro-h)' }}>
          <h1>Contact Section</h1>
        </section>
      </main>
    </div>
  );
}

export default App;
