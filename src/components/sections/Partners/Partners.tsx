import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Partners.module.css';

const PARTNERS = [
  "STUDIO ALFA", "TECHFLOW", "BLOOM DIGITAL", "NEXUS", 
  "QUANTUM", "VORTEX", "HORIZON", "SYNAPSE"
];

export default function Partners() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    let clone: HTMLElement | null = null;
    let tl: gsap.core.Timeline | null = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initMarquee = () => {
      // Cleanup previous state
      if (tl) tl.kill();
      if (clone && wrapper.contains(clone)) {
        wrapper.removeChild(clone);
      }

      // Create a fresh clone
      clone = content.cloneNode(true) as HTMLElement;
      wrapper.appendChild(clone);

      const contentWidth = content.offsetWidth;
      if (contentWidth === 0) return;

      tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "none" }
      });

      tl.to([content, clone], {
        x: `-=${contentWidth}`,
        duration: prefersReducedMotion ? 120 : 30, // Much slower if motion reduced
      });
    };

    // Wait for fonts and initial frame
    document.fonts.ready.then(() => {
      requestAnimationFrame(initMarquee);
    }).catch((err) => {
      console.warn('Fonts loading failed, initializing marquee anyway:', err);
      requestAnimationFrame(initMarquee);
    });

    // Handle Resize with debounce
    let resizeTimer: number = 0;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(initMarquee, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      if (tl) tl.kill();
      if (clone && wrapper.contains(clone)) {
        wrapper.removeChild(clone);
      }
    };
  }, []);

  return (
    <section id="partners" className={styles.section}>
      <div className={styles.marqueeWrapper} ref={wrapperRef}>
        <div className={styles.marqueeContent} ref={contentRef}>
          {PARTNERS.map((partner, i) => (
            <span key={i} className={styles.partner}>
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
