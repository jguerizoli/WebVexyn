import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ResultCard from './ResultCard/ResultCard';
import styles from './Results.module.css';
import { REVIEWS } from './results.data';
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
    
    // Initial centering set to avoid jumps
    gsap.set(cards, { xPercent: -50, yPercent: -50 });

    // Orchestration Configuration
    const config = {
      fanRotation: 4,
      fanX: 140,
      fanY: 5,
      scrollLength: "+=150%"
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: config.scrollLength,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    // Phase 1: Context Reveal (Title)
    tl.fromTo(`.${styles.titleStaged1}`, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "expo.out" }
    );

    tl.fromTo(`.${styles.titleStaged2}`, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "expo.out" },
      "-=0.8"
    );

    // Phase 2: Object Spread (ResultCards)
    cards.forEach((card, i) => {
      const isEven = i % 2 === 0;
      const offset = (i - (cards.length - 1) / 2);
      
      const fanRotation = offset * config.fanRotation;
      const fanX = offset * config.fanX;
      const fanY = Math.abs(offset) * config.fanY;

      // Animate the card root according to the contract
      tl.fromTo(card, 
        { 
          opacity: 0,
          xPercent: -50,
          yPercent: -50,
          y: fanY + 50,
          x: fanX * 0.5,
          rotation: isEven ? -5 : 5,
          scale: 0.95
        },
        { 
          opacity: 1,
          xPercent: -50,
          yPercent: -50,
          y: fanY,
          x: fanX,
          rotation: fanRotation,
          scale: 1,
          duration: 1.5,
          ease: "expo.out"
        },
        "-=1.2"
      );
    });

    // Phase 3: Conversion Reveal (CTA)
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out" },
        "-=1"
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
        <header className="w-full text-center z-10 px-[--respiro-h] mb-12">
          <h2 id="results-title" className="uppercase font-black tracking-[-0.06em] leading-[0.8]">
            <span className={`${styles.titleStaged1} block text-white text-[clamp(3.5rem,8vw,6rem)]`}>Want some</span>
            <span className={`${styles.titleStaged2} block text-[#E5511A] text-[clamp(3.2rem,7.5vw,5.5rem)]`}>proof?</span>
          </h2>
        </header>

        {/* Domain Logic: Results Stack */}
        <div className="relative w-full flex flex-col items-center z-10 px-[--respiro-h] gap-12">
          <div className="relative w-full max-w-7xl flex justify-center items-center h-[300px]">
            {REVIEWS.map((review, i) => (
              <ResultCard 
                key={i} 
                review={review}
                ref={el => cardsRef.current[i] = el}
              />
            ))}
          </div>

          {/* Domain Logic: Conversion Hook */}
          <div ref={ctaRef} className="opacity-0">
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
