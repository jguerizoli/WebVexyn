export const PARTNERS_CONFIG = {
  rows: [
    { id: 'top', speed: 40, direction: -1, opacity: 0.15, fontSize: 'clamp(4rem, 10vw, 8rem)' },
    { id: 'mid', speed: 25, direction: 1, opacity: 0.4, fontSize: 'clamp(3rem, 8vw, 6rem)' },
    { id: 'bot', speed: 55, direction: -1, opacity: 0.1, fontSize: 'clamp(5rem, 12vw, 10rem)' },
  ],
  interaction: {
    mouseVelocityFactor: 0.5,
    maxSpeedMultiplier: 4,
    hoverScale: 1.1,
    hoverColor: '#E5511A',
    lerpFactor: 0.05,
  },
  marquee: {
    resizeDebounce: 200,
    ease: "none",
  },
};
