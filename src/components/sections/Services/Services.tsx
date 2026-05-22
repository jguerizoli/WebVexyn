import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import ServiceCard from './ServiceCard/ServiceCard';
import styles from './Services.module.css';

gsap.registerPlugin(ScrollTrigger);

interface ServicesProps {
  scrollTo: (id: string) => void;
}

const Services: React.FC<ServicesProps> = ({ scrollTo }) => {
  const { t } = useTranslation();
  const container = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);


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
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartX.current;
    const diffY = touch.clientY - touchStartY.current;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const goToCard = (index: number, direction?: 'next' | 'prev') => {
    if (isAnimating || index === activeIndex) return;
    
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const current = cards[activeIndex];
    const next = cards[index];
    
    if (!current || !next || !cardsContainerRef.current) return;

    setIsAnimating(true);
    setActiveIndex(index);

    let dir = direction;
    if (!dir) {
      if (index === 0 && activeIndex === SERVICES_DATA.length - 1) {
        dir = 'next';
      } else if (index === SERVICES_DATA.length - 1 && activeIndex === 0) {
        dir = 'prev';
      } else {
        dir = index > activeIndex ? 'next' : 'prev';
      }
    }

    const counterEl = document.getElementById('services-current');
    if (counterEl) counterEl.innerText = (index + 1).toString().padStart(2, '0');
    const counterMobileEl = document.getElementById('services-current-mobile');
    if (counterMobileEl) counterMobileEl.innerText = (index + 1).toString().padStart(2, '0');

    gsap.set(next, { visibility: "hidden", display: "block", position: "relative" });
    const nextHeight = next.offsetHeight;
    gsap.set(next, { visibility: "visible", display: "block", position: "absolute" });

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    });

    tl.to(cardsContainerRef.current, {
      height: nextHeight,
      duration: 0.6,
      ease: "power2.inOut"
    }, 0);

    const currentExitX = dir === 'next' ? -20 : 20;
    const nextStartX = dir === 'next' ? 20 : -20;

    tl.to(current, {
      xPercent: currentExitX,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      pointerEvents: "none",
      zIndex: 10
    }, 0);

    tl.fromTo(next,
      { xPercent: nextStartX, opacity: 0, zIndex: 50 },
      { 
        xPercent: 0, 
        opacity: 1, 
        duration: 0.6, 
        ease: "power2.inOut",
        pointerEvents: "auto"
      },
      "-=0.4"
    );

    const elements = {
      title: next.querySelector('h3'),
      subtitle: next.querySelector('p'),
      listItems: next.querySelectorAll('li'),
      cta: next.querySelector('button')
    };

    if (elements.title) tl.fromTo(elements.title, { x: dir === 'next' ? 20 : -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, "-=0.6");
    if (elements.subtitle) tl.fromTo(elements.subtitle, { x: dir === 'next' ? 15 : -15, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, "-=0.5");
    if (elements.listItems.length) tl.fromTo(elements.listItems, { x: dir === 'next' ? 10 : -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, "-=0.4");
    if (elements.cta) tl.fromTo(elements.cta, { x: dir === 'next' ? 10 : -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, "-=0.3");
  };

  const handlePrev = () => {
    const prev = (activeIndex - 1 + SERVICES_DATA.length) % SERVICES_DATA.length;
    goToCard(prev, 'prev');
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % SERVICES_DATA.length;
    goToCard(next, 'next');
  };

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    
    gsap.set(cards, { opacity: 0, xPercent: 20, pointerEvents: "none", zIndex: 10 });
    gsap.set(cards[0], { opacity: 1, xPercent: 0, pointerEvents: "auto", zIndex: 50 });

    ScrollTrigger.create({
      trigger: container.current,
      id: "services",
      start: "top top",
      pin: false
    });

    if (cardsContainerRef.current && cards[0]) {
      gsap.set(cardsContainerRef.current, { height: cards[0].offsetHeight });

      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(() => {
          if (cardsContainerRef.current && cards[0]) {
            gsap.set(cardsContainerRef.current, { height: cards[0].offsetHeight });
          }
        });
      }
    }

  }, { scope: container });

  return (
    <section id="services" ref={container} className={styles.section}>
      <div className={styles.grid}>
        <header className={styles.header}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleLine1}>{t('services.title1')}</span>
            <span className={styles.titleLine2}>{t('services.title2')}</span>
          </h2>
          
          {/* Desktop Indicator */}
          <div className={`${styles.indicator} ${styles.desktopOnlyIndicator}`}>
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
                  transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)'
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
          </div>
        </header>
 
        <div 
          ref={cardsContainerRef} 
          className={styles.cardsContainer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {SERVICES_DATA.map((service, i) => (
            <div key={service.id} ref={(el) => { cardsRef.current[i] = el; }} className={styles.stackCard}>
              <ServiceCard service={service} index={i + 1} onCtaClick={() => scrollTo('contact-form')} />
            </div>
          ))}
        </div>

        {/* Mobile Indicator */}
        <div className={`${styles.indicator} ${styles.mobileOnlyIndicator}`}>
          <button onClick={handlePrev} className={styles.navBtn} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
          </button>
          
          <div className={styles.counter}>
            <span className={styles.currentNum} id="services-current-mobile">{(activeIndex + 1).toString().padStart(2, '0')}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.totalNum}>{SERVICES_DATA.length.toString().padStart(2, '0')}</span>
          </div>
          
          <button onClick={handleNext} className={styles.navBtn} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M13 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
