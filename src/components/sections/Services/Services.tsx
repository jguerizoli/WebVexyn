import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ServiceCard from './ServiceCard/ServiceCard';
import { SERVICES_CONFIG } from './services.config';

import styles from './Services.module.css';

gsap.registerPlugin(ScrollTrigger);

const SERVICES_DATA = [
  {
    id: '1',
    title: 'AUTOMAÇÕES',
    subtitle: 'SISTEMAS INTELIGENTES QUE TRABALHAM POR VOCÊ 24/7',
    deliverables: ['PYTHON & AI', 'INTEGRAÇÕES API', 'FLUXOS DE TRABALHO'],
    cta: 'AUTOMATIZAR AGORA'
  },
  {
    id: '2',
    title: 'IDENTIDADE',
    subtitle: 'DESIGN QUE CONSTRÓI AUTORIDADE E PRESENÇA',
    deliverables: ['BRANDING CORE', 'UI/UX DESIGN', 'SISTEMAS VISUAIS'],
    cta: 'CONSTRUIR MARCA'
  },
  {
    id: '3',
    title: 'DESENVOLVIMENTO',
    subtitle: 'ENGENHARIA DE SOFTWARE DE ALTA PERFORMANCE',
    deliverables: ['NEXT.JS / REACT', 'WEBGL / GSAP', 'ARCHITECTURE FIRST'],
    cta: 'INICIAR PROJETO'
  }
];

interface ServicesProps {
  scrollTo: (id: string) => void;
}

const Services: React.FC<ServicesProps> = ({ scrollTo }) => {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const { orchestration, transitions, content } = SERVICES_CONFIG;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: orchestration.start,
        end: `+=${cards.length * orchestration.scrollEndMultiplier}%`,
        pin: orchestration.pin,
        scrub: orchestration.scrub,
      }
    });

    // Initial State
    gsap.set(cards, { yPercent: transitions.entryYPercent, opacity: 0, zIndex: 10 });
    gsap.set(cards[0], { yPercent: 0, opacity: 1, zIndex: 20 });

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return; // No next card to animate in after the last one

      const currentCard = card;
      const nextCard = cards[i + 1];

      // The Transition Phase
      const startTime = i;

      // Current Card EXITS to Top
      tl.to(currentCard, {
        yPercent: transitions.exitYPercent,
        opacity: 0,
        duration: transitions.duration,
        ease: transitions.ease
      }, startTime);

      // Next Card ENTERS from Bottom
      tl.fromTo(nextCard, 
        { 
          yPercent: transitions.entryYPercent,
          opacity: 1,
          zIndex: 30 + i
        },
        { 
          yPercent: 0,
          opacity: 1,
          duration: transitions.duration,
          ease: transitions.ease
        }, 
        startTime
      );

      // Staggered internal content for the NEXT card
      const title = nextCard.querySelector('h3');
      const listItems = nextCard.querySelectorAll('li');
      const cta = nextCard.querySelector('button');

      if (title) {
        tl.fromTo(title, 
          { y: content.title.yOffset, opacity: 0 },
          { y: 0, opacity: 1, duration: content.title.duration, ease: content.title.ease },
          startTime + content.title.delay
        );
      }

      if (listItems.length > 0) {
        tl.fromTo(listItems, 
          { y: content.listItems.yOffset, opacity: 0 },
          { y: 0, opacity: 1, duration: content.listItems.duration, stagger: content.listItems.stagger, ease: content.listItems.ease },
          startTime + content.listItems.delay
        );
      }

      if (cta) {
        tl.fromTo(cta, 
          { y: content.cta.yOffset, opacity: 0 },
          { y: 0, opacity: 1, duration: content.cta.duration, ease: content.cta.ease },
          startTime + content.cta.delay
        );
      }
    });
  }, { scope: container });

  return (
    <section 
      id="services" 
      ref={container} 
      className={styles.section}
    >
      <div className={styles.grid}>
        <header className={styles.header}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleLine1}>WHAT</span>
            <span className={styles.titleLine2}>WE DO</span>
          </h2>
        </header>

        <div className={styles.cardsContainer}>
          {SERVICES_DATA.map((service, i) => (
            <div 
              key={service.id} 
              ref={(el) => { cardsRef.current[i] = el; }}
              className={styles.stackCard}
            >
              <ServiceCard 
                service={service} 
                index={i + 1}
                onCtaClick={() => scrollTo('contact-form')}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
