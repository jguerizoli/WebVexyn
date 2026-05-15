import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import VexynSymbol3D from '../../common/VexynSymbol/VexynSymbol3D';
import Button from '../../common/Button/Button';
import styles from './Hero.module.css';
import { HERO_CONFIG } from './hero.config';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  scrollTo: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ scrollTo }) => {
  const { t } = useTranslation();
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

    // Parallax Effect & Hero Pinning
    const heroST = ScrollTrigger.create({
      trigger: container.current,
      id: "hero", // Crucial for global snap synchronization
      start: "top top",
      end: "+=50%", // Pin for 50% of viewport height
      pin: true,
      anticipatePin: 1,
      snap: 1, // Full-page snap for Hero
      onUpdate: (self) => {
        // Optional: Can tie entrance progress here if needed
      }
    });

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

    return () => {
      tl.kill();
      heroST.kill();
    };
  }, { scope: container });

  return (
    <section id="hero" ref={container} className={styles.heroSection}>
      <div className={styles.heroOverlay}></div>
      
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>{t('hero.title1')}</span>
            <span className={styles.accent}>{t('hero.title2')}</span>
          </h1>
          
          <div className={styles.heroSubtitleWrapper}>
            <div className={styles.heroLine} />
            <p className={styles.heroSubtitle}>
              {t('hero.subtitle')}
            </p>
          </div>
          
          <div className={styles.heroActions}>
            <Button 
              onClick={() => scrollTo('services')} 
              variant="primary"
              size="lg"
            >
              {t('hero.cta_services')}
            </Button>
            <Button 
              onClick={() => scrollTo('contact-form')} 
              variant="ghost"
              size="lg"
            >
              {t('hero.cta_contact')}
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
