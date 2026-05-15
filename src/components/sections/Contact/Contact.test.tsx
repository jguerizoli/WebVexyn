import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from './Contact';
import buttonStyles from '../../common/Button/Button.module.css';

describe('Contact Component', () => {
  it('renders correctly with initial states', () => {
    render(<Contact />);
    expect(screen.getByText(/START A/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/YOUR FULL NAME/i)).toBeDefined();
  });

  it('should have ARIA attributes for accessibility', () => {
    render(<Contact />);
    const nameInput = screen.getByLabelText(/NAME/i);
    expect(nameInput.getAttribute('aria-required')).toBe('true');
    expect(nameInput.getAttribute('required')).not.toBeNull();
  });

  it('should use the standard primary button for submission', () => {
    render(<Contact />);
    const button = screen.getByRole('button', { name: /SEND MESSAGE/i });
    
    // Validate that the button uses the correct CSS Module classes
    expect(button.classList.contains(buttonStyles.button)).toBe(true);
    expect(button.classList.contains(buttonStyles.primary)).toBe(true);
  });

  it('should show technical error labels [REQUIRED] when submitting empty fields', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    const submitBtn = screen.getByRole('button', { name: /SEND MESSAGE/i });
    
    await user.click(submitBtn);
    
    // [REQUIRED] is now aria-hidden="true" but still present in DOM
    const errorLabels = screen.getAllByText(/\[REQUIRED\]/i);
    expect(errorLabels.length).toBeGreaterThan(0);
  });
});
