import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ServiceCard from './ServiceCard';

describe('ServiceCard', () => {
  const mockService = {
    id: '1',
    title: 'AUTOMAÇÕES',
    subtitle: 'SISTEMAS INTELIGENTES',
    deliverables: ['PYTHON & AI', 'INTEGRAÇÕES API'],
    cta: 'CONHECER'
  };

  it('renders the title and subtitle correctly', () => {
    render(<ServiceCard service={mockService} index={1} />);
    
    expect(screen.getByText('AUTOMAÇÕES')).toBeDefined();
    expect(screen.getByText('SISTEMAS INTELIGENTES')).toBeDefined();
  });

  it('renders all deliverables', () => {
    render(<ServiceCard service={mockService} index={1} />);
    
    expect(screen.getByText('PYTHON & AI')).toBeDefined();
    expect(screen.getByText('INTEGRAÇÕES API')).toBeDefined();
  });

  it('calls onCtaClick when button is clicked', () => {
    const onCtaClick = vi.fn();
    render(<ServiceCard service={mockService} index={1} onCtaClick={onCtaClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });
});
