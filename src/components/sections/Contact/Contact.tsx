import React, { useState } from 'react';
import styles from './Contact.module.css';
import Button from '../../common/Button/Button';

export default function Contact() {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSent) return;

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.name) newErrors.name = true;
    if (!formData.email || !isValidEmail(formData.email)) newErrors.email = true;
    if (!formData.message) newErrors.message = true;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted successfully');
      setIsSubmitting(false);
      setIsSent(true);
      
      // Clear form after success
      setFormData({ name: '', email: '', message: '' });
      
      // Optional: reset success state after 5 seconds
      setTimeout(() => setIsSent(false), 5000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  return (
    <section id="contact-form" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.info}>
          <h2 className={styles.title}>START A<br />PROJECT</h2>
          <p className={styles.description}>
            LET'S BUILD THE NEXT GENERATION OF YOUR DIGITAL PRESENCE WITH SURGICAL PRECISION.
          </p>
          
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>LOCATION</span>
              <span className={styles.detailValue}>SAO PAULO / BR</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>EMAIL</span>
              <span className={styles.detailValue}>HELLO@VEXYN.COM</span>
            </div>
          </div>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={`${styles.inputGroup} ${errors.name ? styles.hasError : ''}`}>
            <label htmlFor="name" className={styles.label}>
              NAME {errors.name && <span className={styles.errorMarker}>[REQUIRED]</span>}
            </label>
            <input 
              type="text" 
              name="name"
              id="name"
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={errors.name}
              className={styles.input} 
              placeholder="YOUR FULL NAME" 
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <span id="name-error" className={styles.srOnly}>Name is required</span>}
          </div>
          <div className={`${styles.inputGroup} ${errors.email ? styles.hasError : ''}`}>
            <label htmlFor="email" className={styles.label}>
              EMAIL {errors.email && <span className={styles.errorMarker}>[REQUIRED]</span>}
            </label>
            <input 
              type="email" 
              name="email"
              id="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email}
              className={styles.input} 
              placeholder="EMAIL@EXAMPLE.COM" 
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span id="email-error" className={styles.srOnly}>Email is required</span>}
          </div>
          <div className={`${styles.inputGroup} ${errors.message ? styles.hasError : ''}`}>
            <label htmlFor="message" className={styles.label}>
              MESSAGE {errors.message && <span className={styles.errorMarker}>[REQUIRED]</span>}
            </label>
            <textarea 
              name="message"
              id="message"
              aria-describedby={errors.message ? "message-error" : undefined}
              aria-invalid={errors.message}
              className={`${styles.input} ${styles.textarea}`} 
              placeholder="TELL US ABOUT YOUR PROJECT" 
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
            {errors.message && <span id="message-error" className={styles.srOnly}>Message is required</span>}
          </div>
          
          <Button 
            variant="primary" 
            size="lg" 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting || isSent}
          >
            {isSubmitting ? '[SENDING...]' : isSent ? '[MESSAGE_SENT_SUCCESSFULLY]' : 'SEND MESSAGE'}
          </Button>
        </form>
      </div>
    </section>
  );
}
