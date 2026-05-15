import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VexynMark, VexynWordmark } from '../Icons';

interface FooterProps {
  id?: string;
  scrollTo: (id: string) => void;
}

const Footer: React.FC<FooterProps> = ({ id, scrollTo }) => {
  const { t } = useTranslation();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZone: 'America/Sao_Paulo'
      }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Ensure GSAP knows about the new content
    ScrollTrigger.refresh();
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'services', label: t('nav.services') },
    { id: 'social-proof', label: t('nav.results') },
    { id: 'partners', label: t('nav.partners') },
    { id: 'contact-form', label: t('nav.contact') },
  ];

  const socialLinks = [
    { label: 'Instagram', url: '#' },
    { label: 'LinkedIn', url: '#' },
    { label: 'WhatsApp', url: '#' },
    { label: 'X / Twitter', url: '#' },
  ];

  return (
    <footer id={id} className={styles.footer}>
      <div className={styles.topContainer}>
        <div className={styles.grid}>
          <div className={styles.brandColumn}>
            <div className={styles.visuals}>
              <VexynMark className={styles.brandMark} />
              <VexynWordmark className={styles.wordmark} />
            </div>
            <div className={styles.metaData}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>BSB / TIME</span>
                <span className={styles.metaValue}>{time}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>BSB / SKY</span>
                <span className={styles.metaValue}>
                  <svg className={styles.weatherIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  24°C CLEAR
                </span>
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t('footer.nav')}</h3>
            <ul className={styles.linkList}>
              {navItems.map((item) => (
                <li key={item.id} className={styles.linkItem}>
                  <button 
                    onClick={() => scrollTo(item.id)} 
                    className={styles.link}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t('footer.social')}</h3>
            <ul className={styles.linkList}>
              {socialLinks.map((link) => (
                <li key={link.label} className={styles.linkItem}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.link}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t('footer.legal')}</h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <a href="#" className={styles.link}>{t('footer.privacy')}</a>
              </li>
              <li className={styles.linkItem}>
                <a href="#" className={styles.link}>{t('footer.terms')}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.copyright}>
          {t('footer.copyright')}
        </div>
        <div className={styles.legalLinks}>
          <span className={styles.legalLink}>BRASILIA — 2026</span>
          <span className={styles.legalLink}>DESIGN + CODE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
