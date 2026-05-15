import React from 'react';
import { MessageCircle } from 'lucide-react';
import { APP_CONFIG } from '../../../app.config';
import styles from './WhatsAppButton.module.css';

const WhatsAppButton: React.FC = () => {
  const { number } = APP_CONFIG.whatsapp;
  const whatsappUrl = `https://wa.me/${number}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.whatsappContainer}
      aria-label="Contact us on WhatsApp"
    >
      <div className={styles.btnContent}>
        <MessageCircle size={20} strokeWidth={1.5} />
        <span className={styles.label}>CHAT</span>
      </div>
    </a>
  );
};

export default WhatsAppButton;
