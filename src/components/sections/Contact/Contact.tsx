import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Contact.module.css';
import Button from '../../common/Button/Button';

export default function Contact() {
  const { t } = useTranslation();
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
          <h2 className={styles.title}>{t('contact.title').split(' ').map((word, i) => i === 1 ? <React.Fragment key={i}><br />{word}</React.Fragment> : word + ' ')}</h2>
          <p className={styles.description}>
            {t('contact.description')}
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
