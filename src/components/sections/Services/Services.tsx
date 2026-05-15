import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import ServiceCard from './ServiceCard/ServiceCard';
import { SERVICES_CONFIG } from './services.config';

import styles from './Services.module.css';

gsap.registerPlugin(ScrollTrigger);

interface ServicesProps {
  scrollTo: (id: string) => void;
}

const Services: React.FC<ServicesProps> = ({ scrollTo }) => {
  const { t } = useTranslation();
  const container = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Responsive listener for UI-only toggles
  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SERVICES_DATA = [
    {
      id: '1',
      title: t('services.items.automations.title'),
      subtitle: t('services.items.automations.subtitle'),
      deliverables: t('services.items.automations.deliverables', { returnObjects: true }) as string[],
      cta: t('services.items.automations.cta')
    },
    {
      id: '2',
      title: t('services.items.websites.title'),
      subtitle: t('services.items.websites.subtitle'),
      deliverables: t('services.items.websites.deliverables', { returnObjects: true }) as string[],
      cta: t('services.items.websites.cta')
    },
    {
      id: '3',
      title: t('services.items.traffic.title'),
      subtitle: t('services.items.traffic.subtitle'),
      deliverables: t('services.items.traffic.deliverables', { returnObjects: true }) as string[],
      cta: t('services.items.traffic.cta')
    },
    {
      id: '4',
      title: t('services.items.social.title'),
      subtitle: t('services.items.social.subtitle'),
      deliverables: t('services.items.social.deliverables', { returnObjects: true }) as string[],
      cta: t('services.items.social.cta')
    },
    {
      id: '5',
      title: t('services.items.branding.title'),
      subtitle: t('services.items.branding.subtitle'),
      deliverables: t('services.items.branding.deliverables', { returnObjects: true }) as string[],
      cta: t('services.items.branding.cta')
    }
  ];
  
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const autoTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const goToCard = (index: number) => {
    if (isDesktop && scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const start = st.start;
      const end = st.end;
      const totalScroll = end - start;
      const targetScroll = start + (index / (SERVICES_DATA.length - 1)) * totalScroll;
      
      gsap.to(window, {
        scrollTo: targetScroll,
        duration: 1.2,
        ease: "power3.inOut"
      });
    } else if (autoTimelineRef.current) {
      const tl = autoTimelineRef.current;
      tl.tweenTo(`card-${index}`, { duration: 1, ease: "power3.inOut" });
    }
  };

  const handlePrev = () => {
    const prev = (activeIndex - 1 + SERVICES_DATA.length) % SERVICES_DATA.length;
    goToCard(prev);
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % SERVICES_DATA.length;
    goToCard(next);
  };

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const mm = gsap.matchMedia();

    // --- DESKTOP: SCRUB ORCHESTRATION ---
    mm.add("(min-width: 1024px)", () => {
      // Setup Initial State
      gsap.set(cards, { yPercent: 105, opacity: 0, zIndex: 10 });
      gsap.set(cards[0], { yPercent: 0, opacity: 1, zIndex: 50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          id: "services", // Explicit ID for global snap lookup
          start: "top top",
          end: `+=${SERVICES_DATA.length * SERVICES_CONFIG.orchestration.SCROLL_PER_CARD}`,
          pin: true,
          scrub: SERVICES_CONFIG.orchestration.scrub,
          anticipatePin: 1, // Eliminates the "jump" or delay before pinning
          snap: 1 / (SERVICES_DATA.length - 1), // Snap to each card
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.round(progress * (SERVICES_DATA.length - 1));
            if (newIndex !== activeIndex) {
              setActiveIndex(newIndex);
              // Update counter text directly for performance
              const counterEl = document.getElementById('services-current');
              if (counterEl) counterEl.innerText = (newIndex + 1).toString().padStart(2, '0');
            }
          },
        }
      });
      
      scrollTriggerRef.current = tl.scrollTrigger!;

      cards.forEach((card, i) => {
        if (i === 0) return; // First card is already visible

        const prev = cards[i - 1];
        const current = card;

        // Transition Out Previous & In Current
        tl.to(prev, { 
          yPercent: SERVICES_CONFIG.transitions.exitYPercent, 
          opacity: 0, 
          duration: 1 
        }, i - 0.5);
        
        tl.to(current, { 
          yPercent: 0, 
          opacity: 1, 
          zIndex: 50 + i,
          duration: 1 
        }, i - 0.5);

        // Content Reveal for current card
        const title = current.querySelector('h3');
        const subtitle = current.querySelector('p');
        const listItems = current.querySelectorAll('li');
        const cta = current.querySelector('button');

        if (title) tl.from(title, { y: 20, opacity: 0, duration: 0.4 }, i - 0.2);
        if (subtitle) tl.from(subtitle, { y: 15, opacity: 0, duration: 0.4 }, i - 0.15);
        if (listItems.length) tl.from(listItems, { y: 10, opacity: 0, duration: 0.3, stagger: 0.05 }, i - 0.1);
        if (cta) tl.from(cta, { y: 10, opacity: 0, duration: 0.3 }, i);
      });

      return () => {
        tl.kill();
        scrollTriggerRef.current = null;
      };
    });

    // --- MOBILE: AUTO CAROUSEL FALLBACK ---
    mm.add("(max-width: 1023px)", () => {
      gsap.set(cards, { yPercent: 105, opacity: 0, zIndex: 10 });
      gsap.set(cards[0], { yPercent: 0, opacity: 1, zIndex: 50 });

      const tl = gsap.timeline({ 
        repeat: -1,
        defaults: { ease: "expo.inOut" } 
      });
      autoTimelineRef.current = tl;

      cards.forEach((card, i) => {
        const nextIndex = (i + 1) % cards.length;
        const current = card;
        const next = cards[nextIndex];
        const label = `card-${i}`;

        tl.add(label);
        tl.call(() => setActiveIndex(i), [], label);
        
        // Progress bar simulation for mobile
        tl.fromTo('#services-progress-auto', { scaleX: 0 }, { scaleX: 1, duration: 3, ease: "none" }, label);

        tl.to(current, { yPercent: -105, opacity: 0, duration: 1 });
        tl.to(next, { yPercent: 0, opacity: 1, zIndex: 60, duration: 1 }, "<");
        tl.set(current, { zIndex: 10, yPercent: 105, opacity: 0 });
      });

      return () => tl.kill();
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <section id="services" ref={container} className={styles.section}>
      <div className={styles.grid}>
        <header className={styles.header}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleLine1}>{t('services.title1')}</span>
            <span className={styles.titleLine2}>{t('services.title2')}</span>
          </h2>
          
          <div className={styles.indicator}>
            <div className={styles.counter}>
              <span className={styles.currentNum} id="services-current">{(activeIndex + 1).toString().padStart(2, '0')}</span>
              <span className={styles.separator}>/</span>
              <span className={styles.totalNum}>{SERVICES_DATA.length.toString().padStart(2, '0')}</span>
            </div>
            
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} id="services-progress" style={{ 
                  transform: `scaleX(${activeIndex / (SERVICES_DATA.length - 1)})`,
                  transformOrigin: 'left',
                  transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                  display: isDesktop ? 'block' : 'none'
                }} />
                <div className={styles.progressFill} id="services-progress-auto" style={{ 
                  display: !isDesktop ? 'block' : 'none'
                }} />
              </div>
              
              <div className={styles.navControls}>
                <button onClick={handlePrev} className={styles.navBtn} aria-label="Previous">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 12H5M11 18l-6-6 6-6" />
                  </svg>
                </button>
                <button onClick={handleNext} className={styles.navBtn} aria-label="Next">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.markers}>
              {SERVICES_DATA.map((_, i) => (
                <button 
                  key={i} 
                  className={`${styles.marker}${activeIndex === i ? ` ${styles.markerActive}` : ''}`} 
                  onClick={() => goToCard(i)} 
                />
              ))}
            </div>
          </div>
        </header>

        <div 
          className={styles.cardsContainer}
          onMouseEnter={() => autoTimelineRef.current?.pause()}
          onMouseLeave={() => autoTimelineRef.current?.play()}
        >
          {SERVICES_DATA.map((service, i) => (
            <div key={service.id} ref={(el) => { cardsRef.current[i] = el; }} className={styles.stackCard}>
              <ServiceCard service={service} index={i + 1} onCtaClick={() => scrollTo('contact-form')} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
