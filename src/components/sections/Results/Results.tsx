import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ResultCard from './ResultCard/ResultCard';
import styles from './Results.module.css';
import { REVIEWS } from './results.data';
import { RESULTS_CONFIG } from './results.config';
import Button from '../../common/Button/Button';

gsap.registerPlugin(ScrollTrigger);


interface ResultsProps {
  scrollTo?: (id: string) => void;
}

const Results: React.FC<ResultsProps> = ({ scrollTo }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;
    
    const { orchestration, animations } = RESULTS_CONFIG;

    // Initial centering set to avoid jumps
    gsap.set(cards, { xPercent: -50, yPercent: -50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: orchestration.scrollLength,
        pin: true,
        pinSpacing: true,
        scrub: orchestration.scrub,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        fastScrollEnd: true,
      }
    });

    // Phase 1: Context Reveal (Title)
    tl.fromTo(`.${styles.titleStaged1}`, 
      { y: animations.title.yOffset, opacity: 1 },
      { y: 0, opacity: 1, duration: animations.title.duration, ease: animations.title.ease }
    );

    tl.fromTo(`.${styles.titleStaged2}`, 
      { y: animations.title.yOffset, opacity: 1 },
      { y: 0, opacity: 1, duration: animations.title.duration, ease: animations.title.ease },
      animations.title.staggerOverlap
    );

    // Phase 2: Object Spread (ResultCards)
    cards.forEach((card, i) => {
      const isEven = i % 2 === 0;
      const offset = (i - (cards.length - 1) / 2);
      
      const fanRotation = offset * orchestration.fanRotation;
      const fanX = offset * orchestration.fanX;
      const fanY = Math.abs(offset) * orchestration.fanY;

      // Animate the card root according to the contract
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
          duration: animations.cards.duration,
          ease: animations.cards.ease
        },
        animations.cards.overlap
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
            <span className={styles.titleStaged1}>Want some</span>
            <span className={styles.titleStaged2}>proof?</span>
          </h2>
        </header>

        {/* Domain Logic: Results Stack */}
        <div className={styles.resultsContent}>
          <div className={styles.stackContainer}>
            {REVIEWS.map((review, i) => (
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
              Let's Build Something
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
