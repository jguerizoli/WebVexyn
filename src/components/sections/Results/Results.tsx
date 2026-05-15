import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import ResultCard from './ResultCard/ResultCard';
import styles from './Results.module.css';
import { RESULTS_CONFIG } from './results.config';
import Button from '../../common/Button/Button';

gsap.registerPlugin(ScrollTrigger);

interface ResultsProps {
  scrollTo?: (id: string) => void;
}

const Results: React.FC<ResultsProps> = ({ scrollTo }) => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  const reviews = t('results.reviews', { returnObjects: true }) as any[];

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;
    
    const { orchestration, animations } = RESULTS_CONFIG;

    // Initial centering set to avoid jumps
    gsap.set(cards, { xPercent: -50, yPercent: -50 });

    // Unified Entrance: Title Reveal + Full Fan-out (Automatic)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        id: "social-proof-reveal", // Renamed to avoid snap interference
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // 1. Reveal Title
    tl.fromTo([`.${styles.titleStaged1}`, `.${styles.titleStaged2}`], 
      { y: animations.title.yOffset, opacity: 0 },
      { y: 0, opacity: 1, duration: animations.title.duration, stagger: 0.1, ease: animations.title.ease }
    );

    // 2. Fan-out all cards at once
    cards.forEach((card, i) => {
      const isEven = i % 2 === 0;
      const offset = (i - (cards.length - 1) / 2);
      
      const fanRotation = offset * orchestration.fanRotation;
      const fanX = offset * orchestration.fanX;
      const fanY = Math.abs(offset) * orchestration.fanY;

      tl.fromTo(card, 
        { 
          opacity: 0,
          scale: 0.8,
          xPercent: -50,
          yPercent: -50,
          y: fanY + 100,
          x: fanX * 0.5,
          rotation: isEven ? -10 : 10
        },
        { 
          opacity: 1,
          scale: 1,
          xPercent: -50,
          yPercent: -50,
          y: fanY,
          x: fanX,
          rotation: fanRotation,
          duration: 1.2,
          ease: "expo.out"
        },
        "-=0.8" // Heavy overlap for simultaneous fan-out effect
      );
    });

    // 3. Reveal CTA
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.6"
      );
    }

  }, { scope: sectionRef });

  return (
    <section 
      id="social-proof" 
      className={styles.section}
      ref={sectionRef}
      aria-labelledby="results-title"
    >
      <div className={styles.wrapper}>
        <div className={styles.portalRing} />
        
        {/* Domain Logic: Results Header */}
        <header className={styles.header}>
          <h2 id="results-title" className={styles.title}>
            <span className={styles.titleStaged1}>{t('results.title1')}</span>
            <span className={styles.titleStaged2}>{t('results.title2')}</span>
          </h2>
        </header>

        {/* Domain Logic: Results Stack */}
        <div className={styles.resultsContent}>
          <div className={styles.stackContainer}>
            {reviews.map((review, i) => (
              <ResultCard 
                key={i} 
                review={review}
                ref={el => { cardsRef.current[i] = el; }}
              />
            ))}
          </div>

          {/* Domain Logic: Conversion Hook */}
          <div ref={ctaRef} className={styles.ctaReveal}>
            <Button 
              onClick={() => scrollTo?.('contact-form')}
              variant="primary"
              size="lg"
            >
              {t('results.cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
