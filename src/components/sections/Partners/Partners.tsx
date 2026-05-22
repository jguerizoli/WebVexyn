import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PARTNERS_CONFIG } from './partners.config';
import styles from './Partners.module.css';

gsap.registerPlugin(ScrollTrigger);

const PARTNERS = [
  "STUDIO ALFA", "TECHFLOW", "BLOOM DIGITAL", "NEXUS", 
  "QUANTUM", "VORTEX", "HORIZON", "SYNAPSE", "ORBITAL", "FLUX"
];

const MarqueeRow: React.FC<{ 
  row: typeof PARTNERS_CONFIG.rows[0],
  globalSpeedMultiplier: { current: number },
  scrollSkew: { current: number }
}> = ({ row, globalSpeedMultiplier, scrollSkew }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    
    wrapper.querySelectorAll('[data-clone="true"]').forEach(el => el.remove());

    for (let i = 0; i < 2; i++) {
      const clone = content.cloneNode(true) as HTMLElement;
      clone.setAttribute('data-clone', 'true');
      wrapper.appendChild(clone);
    }

    const contentWidth = content.offsetWidth;
    const items = wrapper.querySelectorAll(`.${styles.marqueeContent}`);

    let isStyled = false;

    const animation = gsap.to(items, {
      x: row.direction < 0 ? `-=${contentWidth}` : `+=${contentWidth}`,
      duration: contentWidth / row.speed,
      ease: "none",
      repeat: -1,
      onUpdate: function() {
        // Compound velocity: Base + Mouse Interaction + Scroll Momentum
        const totalMultiplier = globalSpeedMultiplier.current + (Math.abs(scrollSkew.current) * 0.05);
        this.timeScale(totalMultiplier);
        
        // Dynamic Skewing based on motion
        const skew = scrollSkew.current;
        if (skew !== 0) {
          gsap.set(wrapper, { 
            skewX: skew * 0.1,
            rotateY: skew * 0.05,
            z: Math.abs(skew) * 2
          });
          isStyled = true;
        } else if (isStyled) {
          gsap.set(wrapper, { 
            skewX: 0,
            rotateY: 0,
            z: 0
          });
          isStyled = false;
        }
      }
    });

    return () => animation.kill();
  }, { scope: wrapperRef, dependencies: [row] });

  return (
    <div 
      className={styles.marqueeRow} 
      ref={wrapperRef}
      style={{ 
        opacity: row.opacity,
        '--font-size': row.fontSize
      } as React.CSSProperties}
    >
      <div className={styles.marqueeContent} ref={contentRef}>
        {PARTNERS.map((partner, i) => (
          <span key={i} className={styles.partner} data-text={partner}>
            {partner}
            <span className={styles.dot}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);
  const globalSpeedMultiplier = useRef(1);
  const scrollSkew = useRef(0);

  useGSAP(() => {
    // 1. Mouse Velocity Logic
    const handleMouseMove = (e: MouseEvent) => {
      const dx = Math.abs(e.movementX || 0);
      const targetMultiplier = 1 + (dx * 0.1 * PARTNERS_CONFIG.interaction.mouseVelocityFactor);
      
      gsap.to(globalSpeedMultiplier, {
        current: Math.min(targetMultiplier, PARTNERS_CONFIG.interaction.maxSpeedMultiplier),
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          gsap.to(globalSpeedMultiplier, {
            current: 1,
            duration: 1.2,
            ease: "power1.inOut"
          });
        }
      });
    };

    // 2. Kinetic Scroll Skew Logic
    ScrollTrigger.create({
      id: "partners",
      trigger: sectionRef.current,
      onUpdate: (self) => {
        const vel = self.getVelocity() / 100;
        gsap.to(scrollSkew, {
          current: vel,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => {
            gsap.to(scrollSkew, {
              current: 0,
              duration: 0.8,
              ease: "power1.inOut"
            });
          }
        });
      }
    });

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: sectionRef });

  return (
    <section id="partners" ref={sectionRef} className={styles.section}>
      <div className={styles.perspectiveContainer}>
        <div className={styles.gridOverlay} aria-hidden="true" />
        <div className={styles.rowsContainer}>
          {PARTNERS_CONFIG.rows.map((row) => (
            <MarqueeRow 
              key={row.id} 
              row={row} 
              globalSpeedMultiplier={globalSpeedMultiplier}
              scrollSkew={scrollSkew}
            />
          ))}
        </div>
        <div className={styles.scanLine} aria-hidden="true" />
      </div>
    </section>
  );
}
