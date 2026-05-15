import React from 'react';
import { useTranslation } from 'react-i18next';
import { Hexagon, Ruler, Circle, Grid3x3, Info } from 'lucide-react';
import { VexynMark } from '../Icons';
import styles from './Sidebar.module.css';

import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';

interface SidebarProps {
    activeSection: string;
    scrollTo: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, scrollTo }) => {
    const { t } = useTranslation();
    
    const navItems = [
        { id: 'hero',        label: 'HOME',               icon: Hexagon  },
        { id: 'services',    label: t('nav.services'),    icon: Grid3x3  },
        { id: 'social-proof',label: t('nav.results'),     icon: Info     },
        { id: 'partners',    label: t('nav.partners'),    icon: Circle   },
        { id: 'contact-form',label: t('nav.contact'),     icon: Ruler    },
    ];
    return (
        <div
            className={styles.markerSidebar}
            style={{ boxShadow: '4px 0 32px 8px rgba(0,0,0,0.85)' }}
        >
            <div className={styles.topSection}>
                {/* Brand mark */}
                <div className={styles.sidebarLogo}>
                    <button
                        onClick={() => scrollTo('hero')}
                        className={styles.sidebarLogoBtn}
                    >
                        <VexynMark className="vx-mark" />
                    </button>
                </div>


                {/* Nav items */}
                <nav className={styles.sidebarNav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => scrollTo(item.id)}
                                className={`${styles.sidebarNavItem}${isActive ? ` ${styles.isActive}` : ''}`}
                                title={item.label}
                            >
                                <Icon size={20} strokeWidth={1.5} />
                                <span className={styles.sidebarNavLabel}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className={styles.bottomSection}>
                <LanguageSwitcher />
            </div>
        </div>
  );
};

export default Sidebar;
