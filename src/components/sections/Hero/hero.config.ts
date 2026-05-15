export const HERO_CONFIG = {
  entrance: {
    title: {
      xOffset: -100,
      duration: 1,
      delay: 0.2,
      ease: 'power4.out',
    },
    subtitle: {
      yOffset: 20,
      duration: 0.5,
      overlap: '-=0.5',
      ease: 'power4.out',
    },
    actions: {
      yOffset: 20,
      duration: 0.5,
      overlap: '-=0.3',
      ease: 'power4.out',
    },
    symbol: {
      opacity: 0,
      xOffset: 100,
      duration: 1.5,
      overlap: '-=1',
      ease: 'power2.inOut',
    },
  },
  parallax: {
    symbolY: -150,
    scrub: true,
    start: 'top top',
    end: 'bottom top',
  },
};
