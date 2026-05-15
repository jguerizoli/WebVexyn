import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Contact.module.css';
import Button from '../../common/Button/Button';
import gsap from 'gsap';

export default function Contact() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const triggerConfetti = () => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const colors = ['#E5511A', '#ffffff', '#555555', '#222222'];
    const count = 40;

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = `${gsap.utils.random(6, 12)}px`;
      confetti.style.height = `${gsap.utils.random(6, 12)}px`;
      confetti.style.backgroundColor = gsap.utils.random(colors);
      confetti.style.top = `${centerY}px`;
      confetti.style.left = `${centerX}px`;
      confetti.style.zIndex = '9999';
      confetti.style.pointerEvents = 'none';
      document.body.appendChild(confetti);

      const angle = gsap.utils.random(0, Math.PI * 2);
      const velocity = gsap.utils.random(100, 250);
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity;

      gsap.to(confetti, {
        x: x,
        y: y - 100, // Upwards arc
        rotation: gsap.utils.random(0, 720),
        scale: 0,
        opacity: 0,
        duration: gsap.utils.random(1, 2),
        ease: "power2.out",
        onComplete: () => confetti.remove()
      });
    }
  };

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
      
      setIsSubmitting(false);
      setIsSent(true);
      triggerConfetti();
      
      // Clear form after success
      setFormData({ name: '', email: '', message: '' });
      
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
          <h2 className={styles.title}>{t('contact.title').split(' ').map((word, i) => i === 1 ? <React.Fragment key={i}><br />{word}</React.Fragment> : word + ' ')}</h2>
          <p className={styles.description}>
            {t('contact.description')}
          </p>
          
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>LOCATION</span>
              <span className={styles.detailValue}>BRASILIA / BR</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>EMAIL</span>
              <span className={styles.detailValue}>HELLO@VEXYN.COM</span>
            </div>
          </div>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* ARIA Live Region for Status Updates */}
          <div 
            className={styles.srOnly} 
            role="status" 
            aria-live="polite"
          >
            {isSubmitting && t('contact.status.sending')}
            {isSent && t('contact.status.sent')}
            {Object.keys(errors).length > 0 && `Form has ${Object.keys(errors).length} errors.`}
          </div>

          <div className={`${styles.inputGroup} ${errors.name ? styles.hasError : ''}`}>
            <label htmlFor="name" className={styles.label}>
              {t('contact.labels.name')} {errors.name && <span className={styles.errorMarker} aria-hidden="true">{t('contact.labels.required')}</span>}
            </label>
            <input 
              type="text" 
              name="name"
              id="name"
              required
              aria-required="true"
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={errors.name ? "true" : "false"}
              className={styles.input} 
              placeholder={t('contact.placeholders.name')} 
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <span id="name-error" className={styles.srOnly}>{t('contact.status.errors.name')}</span>}
          </div>
          <div className={`${styles.inputGroup} ${errors.email ? styles.hasError : ''}`}>
            <label htmlFor="email" className={styles.label}>
              {t('contact.labels.email')} {errors.email && <span className={styles.errorMarker} aria-hidden="true">{t('contact.labels.required')}</span>}
            </label>
            <input 
              type="email" 
              name="email"
              id="email"
              required
              aria-required="true"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email ? "true" : "false"}
              className={styles.input} 
              placeholder={t('contact.placeholders.email')} 
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span id="email-error" className={styles.srOnly}>{t('contact.status.errors.email')}</span>}
          </div>
          <div className={`${styles.inputGroup} ${errors.message ? styles.hasError : ''}`}>
            <label htmlFor="message" className={styles.label}>
              {t('contact.labels.message')} {errors.message && <span className={styles.errorMarker} aria-hidden="true">{t('contact.labels.required')}</span>}
            </label>
            <textarea 
              name="message"
              id="message"
              required
              aria-required="true"
              aria-describedby={errors.message ? "message-error" : undefined}
              aria-invalid={errors.message ? "true" : "false"}
              className={`${styles.input} ${styles.textarea}`} 
              placeholder={t('contact.placeholders.message')} 
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
            {errors.message && <span id="message-error" className={styles.srOnly}>{t('contact.status.errors.message')}</span>}
          </div>
          
          <Button 
            ref={buttonRef}
            variant="primary" 
            size="lg" 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting || isSent}
            aria-disabled={isSubmitting || isSent}
          >
            {isSubmitting ? t('contact.status.sending') : isSent ? t('contact.status.sent') : t('contact.status.send')}
          </Button>
        </form>
      </div>
    </section>
  );
}
