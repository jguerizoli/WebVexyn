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

    // Phase 1: Context Reveal (Title) - NON-SCRUBBED for immediate impact
    gsap.fromTo([`.${styles.titleStaged1}`, `.${styles.titleStaged2}`], 
      { y: animations.title.yOffset, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: animations.title.duration, 
        stagger: 0.2,
        ease: animations.title.ease,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Phase 2: Object Spread (ResultCards) - SEQUENTIAL for stepping
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        id: "social-proof",
        start: "top top",
        end: `+=${reviews.length * 800}`, // Standardized scroll length for predictable stepping
        pin: true,
        pinSpacing: true,
        scrub: orchestration.scrub,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        snap: 1 / reviews.length, // Snap to each card milestone
      }
    });

    cards.forEach((card, i) => {
      const isEven = i % 2 === 0;
      const offset = (i - (cards.length - 1) / 2);
      
      const fanRotation = offset * orchestration.fanRotation;
      const fanX = offset * orchestration.fanX;
      const fanY = Math.abs(offset) * orchestration.fanY;

      // Animate cards one after another without overlap to match snap points
      tl.fromTo(card, 
        { 
          opacity: 0,
          xPercent: -50,
          yPercent: -50,
          y: fanY + animations.cards.yOffset,
          x: fanX * 0.5,
          rotation: isEven ? -animations.cards.initialRotation : animations.cards.initialRotation,
          scale: animations.cards.scale
        },
        { 
          opacity: 1,
          xPercent: -50,
          yPercent: -50,
          y: fanY,
          x: fanX,
          rotation: fanRotation,
          scale: 1,
          duration: 1,
          ease: "power2.out"
        }
      );
    });

    // Phase 3: Conversion Reveal (CTA)
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current,
        { y: animations.cta.yOffset, opacity: 0 },
        { y: 0, opacity: 1, duration: animations.cta.duration, ease: animations.cta.ease },
        animations.cta.overlap
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
