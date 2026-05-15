export const SERVICES_CONFIG = {
  orchestration: {
    SCROLL_PER_CARD: 800, // Distance (px) user must scroll to change one card
    scrub: 1, // Increased for smoother architectural feel
    pin: true,
    start: 'top top',
  },
  transitions: {
    duration: 1,
    ease: 'expo.inOut',
    exitYPercent: -105, // Current card exits to top
    entryYPercent: 105,  // Next card enters from bottom
  },
  content: {
    title: {
      yOffset: 30,
      duration: 0.5,
      ease: 'power3.out',
      delay: 0.4,
    },
    listItems: {
      yOffset: 20,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 0.5,
    },
    cta: {
      yOffset: 15,
      duration: 0.3,
      ease: 'back.out(1.7)',
      delay: 0.7,
    },
  },
};
