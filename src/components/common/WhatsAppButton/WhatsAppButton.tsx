import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { APP_CONFIG } from '../../../app.config';
import styles from './WhatsAppButton.module.css';
import WhatsAppModal from '../WhatsAppModal/WhatsAppModal';

const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth || 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const WhatsAppButton: React.FC = () => {
  const { number } = APP_CONFIG.whatsapp;
  const whatsappUrl = `https://wa.me/${number}`;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmWhatsApp = () => {
    setIsModalOpen(false);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className={styles.topRightActions}>
        <div className={styles.socialButtons}>
          <a
            href="https://www.instagram.com/vexyncompany"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label="Instagram"
          >
            <InstagramIcon width={16} height={16} strokeWidth={1.5} />
          </a>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.whatsappContainer}
          aria-label="Contact us on WhatsApp"
        >
          <div className={styles.btnContent}>
            <MessageCircle size={20} strokeWidth={1.5} />
            <span className={styles.label}>CHAT</span>
          </div>
        </button>
      </div>
      <WhatsAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmWhatsApp}
      />
    </>
  );
};

export default WhatsAppButton;
