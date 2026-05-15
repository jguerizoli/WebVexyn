import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VexynSymbol3D from '../../common/VexynSymbol/VexynSymbol3D';
import Button from '../../common/Button/Button';
import styles from './Hero.module.css';
import { HERO_CONFIG } from './hero.config';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  scrollTo: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ scrollTo }) => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const { entrance, parallax } = HERO_CONFIG;
    const tl = gsap.timeline();

    // Entrance Sequence: High-impact cuts
    tl.from(`.${styles.heroTitle}`, { 
      x: entrance.title.xOffset, 
      opacity: 0, 
      delay: entrance.title.delay,
      duration: entrance.title.duration,
      ease: entrance.title.ease
    })
    .from(`.${styles.heroSubtitle}`, { 
      y: entrance.subtitle.yOffset, 
      opacity: 0, 
      duration: entrance.subtitle.duration,
      ease: entrance.subtitle.ease
    }, entrance.subtitle.overlap)
    .from(`.${styles.heroActions}`, { 
      y: entrance.actions.yOffset, 
      opacity: 0, 
      duration: entrance.actions.duration,
      ease: entrance.actions.ease
    }, entrance.actions.overlap)
    .from(`.${styles.heroSymbolWrapper}`, {
      opacity: entrance.symbol.opacity,
      x: entrance.symbol.xOffset,
      duration: entrance.symbol.duration,
      ease: entrance.symbol.ease
    }, entrance.symbol.overlap);

    // Parallax Effect
    gsap.to(`.${styles.heroSymbolWrapper}`, {
      y: parallax.symbolY,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: parallax.start,
        end: parallax.end,
        scrub: parallax.scrub
      }
    });

  }, { scope: container });

  return (
    <section id="hero" ref={container} className={styles.heroSection}>
      <div className={styles.heroOverlay}></div>
      
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>design + code</span>
            <span className={styles.accent}>change the future</span>
          </h1>
          
          <div className={styles.heroSubtitleWrapper}>
            <div className={styles.heroLine} />
            <p className={styles.heroSubtitle}>
              We do both. Every day.
            </p>
          </div>
          
          <div className={styles.heroActions}>
            <Button 
              onClick={() => scrollTo('services')} 
              variant="primary"
              size="lg"
            >
              Explore Services
            </Button>
            <Button 
              onClick={() => scrollTo('contact-form')} 
              variant="ghost"
              size="lg"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Symbol: Anchored Right (3D Shader Version) */}
      <div className={styles.heroSymbolWrapper}>
        <VexynSymbol3D 
          size="600px" 
          className={styles.heroSymbol} 
        />
      </div>
    </section>
  );
};

export default Hero;
