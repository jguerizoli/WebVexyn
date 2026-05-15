import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('en') ? 'pt' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const currentLang = i18n.language.startsWith('en') ? 'EN' : 'PT';

  return (
    <button 
      className={styles.switcher} 
      onClick={toggleLanguage}
      aria-label={`Switch to ${currentLang === 'EN' ? 'Portuguese' : 'English'}`}
    >
      <span className={styles.label}>LANG</span>
      <span className={styles.value}>{currentLang}</span>
    </button>
  );
};

export default LanguageSwitcher;
