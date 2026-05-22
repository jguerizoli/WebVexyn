import React, { useEffect } from 'react';
import styles from './WhatsAppModal.module.css';
import { MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
          <X size={20} strokeWidth={1.5} />
        </button>
        <div className={styles.header}>
          <MessageCircle size={28} className={styles.icon} strokeWidth={1.5} />
          <h3 className={styles.title}>{t('whatsapp_modal.title')}</h3>
        </div>
        <p className={styles.message}>
          {t('whatsapp_modal.message')}
        </p>
        <div className={styles.actions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            {t('whatsapp_modal.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;
