export const RESULTS_CONFIG = {
  orchestration: {
    fanRotation: 4,
    fanX: 140,
    fanY: 5,
    scrollLength: "+=150%",
    scrub: 1,
  },
  animations: {
    title: {
      duration: 1,
      ease: "expo.out",
      yOffset: 50,
      staggerOverlap: "-=0.8",
    },
    cards: {
      duration: 1.5,
      ease: "expo.out",
      yOffset: 50,
      initialRotation: 5,
      scale: 0.95,
      overlap: "-=1.2",
    },
    cta: {
      duration: 1,
      ease: "expo.out",
      yOffset: 30,
      overlap: "-=1",
    },
  },
};
