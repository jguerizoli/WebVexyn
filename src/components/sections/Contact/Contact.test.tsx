import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from './Contact';
import buttonStyles from '../../common/Button/Button.module.css';

describe('Contact Component', () => {
  it('renders correctly with initial states', () => {
    render(<Contact />);
    expect(screen.getByText(/READY TO START/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/YOUR FULL NAME/i)).toBeDefined();
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
    
    const errorLabels = screen.getAllByText(/\[REQUIRED\]/i);
    expect(errorLabels.length).toBeGreaterThan(0);
  });
});
