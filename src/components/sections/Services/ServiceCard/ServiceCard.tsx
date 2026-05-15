import React from 'react';
import styles from './ServiceCard.module.css';
import Button from '../../../common/Button/Button';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  deliverables: string[];
  cta: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
  onCtaClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  index: _index,
  onCtaClick, 
  className, 
  style 
}) => {
  return (
    <div className={`${styles.card} ${className || ''}`} style={style}>
      <div className={styles.mainContent}>
        <div className={styles.topSection}>
          <div className={styles.titleWrapper}>
            <h3 className={styles.title}>{service.title}</h3>
          </div>
          <p className={styles.subtitle}>{service.subtitle}</p>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.deliverablesBox}>
            <ul className={styles.list}>
              {service.deliverables.map((item) => (
                <li key={item} className={styles.listItem}>
                  <span className={styles.bullet} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className={styles.ctaWrapper}>
            <Button variant="primary" size="md" onClick={onCtaClick}>
              {service.cta}
              <span className={styles.arrow}>→</span>
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ServiceCard;
