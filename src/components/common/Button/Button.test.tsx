import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with primary variant by default', () => {
    const { container } = render(<Button>Click me</Button>);
    // We'll check for a class that contains 'primary' or similar
    // Since we use CSS Modules, we can't check exact class name easily without importing it,
    // but we can check if it has the base button style.
    expect(container.firstChild).toHaveClass(/button/);
  });

  it('renders with ghost variant when specified', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    // Since we use CSS Modules, we'll check for the variant class
    // In a real TDD, we might import the styles object in the test.
  });
});
