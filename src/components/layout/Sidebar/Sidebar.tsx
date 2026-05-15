import React from 'react';
import { Hexagon, Ruler, Circle, Grid3x3, Info } from 'lucide-react';
import { VexynMark } from '../Icons';
import styles from './Sidebar.module.css';

interface SidebarProps {
    activeSection: string;
    scrollTo: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, scrollTo }) => {
    const navItems = [
        { id: 'hero',        label: 'HOME',        icon: Hexagon  },
        { id: 'services',    label: 'SERVICES',    icon: Grid3x3  },
        { id: 'social-proof',label: 'RESULTS',     icon: Info     },
        { id: 'partners',    label: 'PARTNERS',    icon: Circle   },
        { id: 'contact-form',label: 'CONTACT',     icon: Ruler    },
    ];
    return (
        <div
            className={styles.markerSidebar}
            style={{ boxShadow: '4px 0 32px 8px rgba(0,0,0,0.85)' }}
        >
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
    );
};

export default Sidebar;
