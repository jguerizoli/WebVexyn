import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Results from './Results';

// Mock GSAP and ScrollTrigger since they don't work in JSDOM
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    })),
    utils: {
      toArray: vi.fn((selector) => []),
    },
    set: vi.fn(),
    context: vi.fn((fn) => {
      fn();
      return { revert: vi.fn() };
    }),
  },
  gsap: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    })),
    utils: {
      toArray: vi.fn((selector) => []),
    },
    set: vi.fn(),
    context: vi.fn((fn) => {
      fn();
      return { revert: vi.fn() };
    }),
  }
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: vi.fn(),
}));

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((fn) => fn()),
}));

describe('Results Section', () => {
  it('renders the section title "Want some proof?"', () => {
    render(<Results />);
    expect(screen.getByText(/Want some/i)).toBeInTheDocument();
    expect(screen.getByText(/proof\?/i)).toBeInTheDocument();
  });

  it('renders the correct number of review cards', () => {
    const { container } = render(<Results />);
    // Looking for article elements which are ResultCards
    const cards = container.querySelectorAll('article');
    expect(cards.length).toBe(4);
  });

  it('renders the heading text correctly', () => {
    render(<Results />);
    expect(screen.getByText(/want some/i)).toBeInTheDocument();
    expect(screen.getByText(/proof\?/i)).toBeInTheDocument();
  });
});
