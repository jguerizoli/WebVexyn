import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}, ref) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    className
  ].join(' ').trim();

  return (
    <button ref={ref} className={buttonClasses} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
