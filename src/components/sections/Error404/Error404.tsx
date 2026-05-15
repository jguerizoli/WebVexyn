import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Grid3x3, LifeBuoy } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './Error404.module.css';

const Error404: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just clear or log. In a real app, this would filter or redirect.
    console.log('Searching for:', searchQuery);
    setSearchQuery('');
  };

  return (
    <div className={styles.errorPage}>
      <div className={styles.container}>
        <div className={styles.badge}>ERROR_CODE: 404</div>
        
        <h1 className={styles.title}>
          <span>PÁGINA</span>
          <span className={styles.accent}>NÃO ENCONTRADA</span>
        </h1>
        
        <p className={styles.message}>
          {t('error404.message')}
        </p>

        <form className={styles.searchBox} onSubmit={handleSearch}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder={t('error404.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchBtn}>
            BUSCAR
          </button>
        </form>

        <div className={styles.actions}>
          <Button 
            onClick={() => navigate('/')} 
            variant="primary" 
            size="lg"
            className={styles.actionBtn}
          >
            <Home size={20} />
            {t('error404.buttons.home')}
          </Button>
          
          <Button 
            onClick={() => navigate('/#services')} 
            variant="ghost" 
            size="lg"
            className={styles.actionBtn}
          >
            <Grid3x3 size={20} />
            {t('error404.buttons.services')}
          </Button>

          <Button 
            onClick={() => window.open('https://wa.me/5561999999999', '_blank')} 
            variant="ghost" 
            size="lg"
            className={styles.actionBtn}
          >
            <LifeBuoy size={20} />
            {t('error404.buttons.support')}
          </Button>
        </div>
      </div>

      <div className={styles.backgroundText}>404</div>
    </div>
  );
};

export default Error404;
