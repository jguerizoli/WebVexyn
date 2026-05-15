import React, { useRef } from 'react';
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
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const activeIndexRef = useRef(0);
  const isHoveredRef = useRef(false);

  const goToCard = (index: number) => {
    if (!timelineRef.current) return;
    const tl = timelineRef.current;
    const currentIndex = activeIndexRef.current;

    const onNavComplete = () => {
      if (!isHoveredRef.current) tl.play();
    };

    if (currentIndex === SERVICES_DATA.length - 1 && index === 0) {
      tl.tweenTo(tl.duration(), { 
        duration: 1, 
        ease: "power3.inOut",
        onComplete: () => { tl.play(0); onNavComplete(); }
      });
    } 
    else if (currentIndex === 0 && index === SERVICES_DATA.length - 1) {
      tl.pause(); tl.progress(1);
      tl.tweenTo(`card-${index}`, { duration: 1, ease: "power3.inOut", onComplete: onNavComplete });
    }
    else {
      tl.tweenTo(`card-${index}`, { duration: 1, ease: "power3.inOut", onComplete: onNavComplete });
    }
  };

  const handlePrev = () => {
    const prev = (activeIndexRef.current - 1 + SERVICES_DATA.length) % SERVICES_DATA.length;
    goToCard(prev);
  };

  const handleNext = () => {
    const next = (activeIndexRef.current + 1) % SERVICES_DATA.length;
    goToCard(next);
  };

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    
    // Initial Prep
    gsap.set(cards, { yPercent: 105, opacity: 0, zIndex: 10, force3D: true });
    gsap.set(cards[0], { yPercent: 0, opacity: 1, zIndex: 50 });
    gsap.set('#services-progress', { scaleX: 0, transformOrigin: 'left' });

    const tl = gsap.timeline({ 
      repeat: -1, 
      paused: true,
      defaults: { ease: "expo.inOut" } 
    });
    timelineRef.current = tl;

    const markers = container.current?.querySelectorAll(`.${styles.marker}`);

    // --- INITIAL REVEAL (First Card) ---
    const fCard = cards[0];
    const fTitle = fCard.querySelector('h3');
    const fSubtitle = fCard.querySelector('p');
    const fListItems = fCard.querySelectorAll('li');
    const fCta = fCard.querySelector('button');

    tl.add('init');
    if (fTitle || fSubtitle) tl.from([fTitle, fSubtitle].filter(Boolean), { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "init+=0.2");
    if (fListItems.length > 0) tl.from(fListItems, { y: 15, opacity: 0, duration: 0.5, stagger: 0.05 }, "init+=0.3");
    if (fCta) tl.from(fCta, { y: 10, opacity: 0, duration: 0.5 }, "init+=0.5");

    cards.forEach((card, i) => {
      const nextIndex = (i + 1) % cards.length;
      const current = card;
      const next = cards[nextIndex];
      const label = `card-${i}`;
      const transLabel = `trans-${i}`;

      tl.add(label);
      
      tl.call(() => {
        activeIndexRef.current = i;
        markers?.forEach((m, idx) => {
          if (idx === i) m.classList.add(styles.markerActive);
          else m.classList.remove(styles.markerActive);
        });
      }, [], label);

      // Timer Bar
      tl.fromTo('#services-progress', { scaleX: 0 }, { scaleX: 1, duration: 3, ease: "none" }, label);

      // Transition Start
      tl.add(transLabel);
      
      // Update Counter
      tl.to('#services-current', {
        innerText: (nextIndex + 1).toString().padStart(2, '0'),
        snap: { innerText: 1 },
        duration: 0.1
      }, `${transLabel}+=0.5`);

      // Prepare & Move Cards
      tl.set(next, { yPercent: 105, opacity: 1, zIndex: 60 }, transLabel);
      tl.to(current, { yPercent: -105, opacity: 0, duration: 1 }, transLabel);
      tl.to(next, { yPercent: 0, opacity: 1, duration: 1 }, transLabel);

      // --- REVEAL NEXT CONTENT DURING TRANSITION ---
      const nTitle = next.querySelector('h3');
      const nSubtitle = next.querySelector('p');
      const nListItems = next.querySelectorAll('li');
      const nCta = next.querySelector('button');

      if (nTitle || nSubtitle) {
        tl.fromTo([nTitle, nSubtitle].filter(Boolean), 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }, 
          `${transLabel}+=0.4`
        );
      }
      if (nListItems.length > 0) {
        tl.fromTo(nListItems, 
          { y: 15, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.03, ease: "power2.out" }, 
          `${transLabel}+=0.5`
        );
      }
      if (nCta) {
        tl.fromTo(nCta, 
          { y: 10, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 
          `${transLabel}+=0.7`
        );
      }

      tl.set(current, { zIndex: 10, yPercent: 105, opacity: 0 });
    });

    const st = ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: `+=${cards.length * 100}%`,
      pin: true,
      onEnter: () => tl.play(),
      onEnterBack: () => tl.play(),
      onLeave: () => tl.pause(),
      onLeaveBack: () => tl.pause(),
    });

    if (ScrollTrigger.isInViewport(container.current!)) tl.play();

    return () => {
      tl.kill();
      st.kill();
    };
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
              <span className={styles.currentNum} id="services-current">01</span>
              <span className={styles.separator}>/</span>
              <span className={styles.totalNum}>{SERVICES_DATA.length.toString().padStart(2, '0')}</span>
            </div>
            
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} id="services-progress" />
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
                <button key={i} className={styles.marker} onClick={() => goToCard(i)} />
              ))}
            </div>
          </div>
        </header>

        <div 
          className={styles.cardsContainer}
          onMouseEnter={() => { timelineRef.current?.pause(); isHoveredRef.current = true; }}
          onMouseLeave={() => { timelineRef.current?.play(); isHoveredRef.current = false; }}
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
