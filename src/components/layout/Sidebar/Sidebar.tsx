import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hexagon, Ruler, Circle, Grid3x3, Info, MessageCircle } from 'lucide-react';
import { VexynMark } from '../Icons';
import styles from './Sidebar.module.css';

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

import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';
import { APP_CONFIG } from '../../../app.config';
import WhatsAppModal from '../../common/WhatsAppModal/WhatsAppModal';

interface SidebarProps {
    activeSection: string;
    scrollTo: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, scrollTo }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const getEffectiveActiveId = (id: string, isMobileNav: boolean) => {
        if (id === 'site-footer') return 'contact-form';
        if (id === 'partners' && isMobileNav) return 'social-proof';
        return id;
    };

    const navItems = [
        { id: 'hero',        label: 'HOME',               icon: Hexagon  },
        { id: 'services',    label: t('nav.services'),    icon: Grid3x3  },
        { id: 'social-proof',label: t('nav.results'),     icon: Info     },
        { id: 'partners',    label: t('nav.partners'),    icon: Circle   },
        { id: 'contact-form',label: t('nav.contact'),     icon: Ruler    },
    ];

    const mobileNavItems = [
        { id: 'hero',         label: 'HOME',               icon: Hexagon,       type: 'nav' as const },
        { id: 'services',     label: t('nav.services'),    icon: Grid3x3,       type: 'nav' as const },
        { id: 'whatsapp',     label: 'WhatsApp',           icon: MessageCircle, type: 'whatsapp' as const },
        { id: 'social-proof', label: t('nav.results'),     icon: Info,          type: 'nav' as const },
        { id: 'contact-form', label: t('nav.contact'),     icon: Ruler,         type: 'nav' as const },
    ];

    const whatsappUrl = `https://wa.me/${APP_CONFIG.whatsapp.number}`;

    const handleConfirmWhatsApp = () => {
        setIsModalOpen(false);
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            {/* Mobile Top Header */}
            <div className={styles.mobileHeader}>
                <button
                    onClick={() => scrollTo('hero')}
                    className={styles.mobileLogoBtn}
                    aria-label="Home"
                >
                    <VexynMark className="vx-mark" />
                </button>
                <div className={styles.mobileHeaderRight}>
                    <a
                        href="https://www.instagram.com/vexyncompany"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialMobileBtn}
                        aria-label="Instagram"
                    >
                        <InstagramIcon width={18} height={18} strokeWidth={1.5} />
                    </a>
                    <LanguageSwitcher />
                </div>
            </div>

            <div
                className={styles.markerSidebar}
                style={{ boxShadow: '4px 0 32px 8px rgba(0,0,0,0.85)' }}
            >
                <div className={styles.topSection}>
                    {/* Brand mark (Desktop Only) */}
                    <div className={styles.sidebarLogo}>
                        <button
                            onClick={() => scrollTo('hero')}
                            className={styles.sidebarLogoBtn}
                        >
                            <VexynMark className="vx-mark" />
                        </button>
                    </div>


                    {/* Desktop Nav items */}
                    <nav className={`${styles.sidebarNav} ${styles.desktopNav}`}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = getEffectiveActiveId(activeSection, false) === item.id;

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

                    {/* Mobile Nav items */}
                    <nav className={`${styles.sidebarNav} ${styles.mobileNav}`}>
                        {mobileNavItems.map((item) => {
                            const Icon = item.icon;

                            if (item.type === 'whatsapp') {
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles.whatsappNavItem}
                                        title={item.label}
                                    >
                                        <Icon size={20} strokeWidth={1.5} />
                                    </button>
                                );
                            }

                            const isActive = getEffectiveActiveId(activeSection, true) === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className={`${styles.sidebarNavItem}${isActive ? ` ${styles.isActive}` : ''}`}
                                    title={item.label}
                                >
                                    <Icon size={20} strokeWidth={1.5} />
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Language Switcher (Desktop Only) */}
                <div className={styles.bottomSection}>
                    <LanguageSwitcher />
                </div>
            </div>
            <WhatsAppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmWhatsApp}
            />
        </>
  );
};

export default Sidebar;
