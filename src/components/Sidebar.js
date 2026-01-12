"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import { LayoutDashboard, CreditCard, Settings, LogOut, User, Shield, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthProvider';

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, profile } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    // Admin Check
    const isAdmin = user?.email === 'admin@velocity.com' || user?.email?.includes('admin');

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            // Force a full page reload to clear all state
            window.location.href = '/auth';
        } catch (error) {
            console.error('Logout error:', error);
            // Force redirect even if signOut fails
            window.location.href = '/auth';
        }
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className={styles.mobileToggle}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Sidebar"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.brand}>
                    <div className={styles.logoIcon}></div>
                    <span className={styles.logoText}>Velocity</span>
                </div>

                <nav className={styles.nav}>
                    {!isAdmin && (
                        <>
                            <Link
                                href="/dashboard"
                                className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <LayoutDashboard size={20} />
                                <span>Overview</span>
                            </Link>
                            <Link
                                href="/dashboard/billing"
                                className={`${styles.navItem} ${pathname === '/dashboard/billing' ? styles.active : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <CreditCard size={20} />
                                <span>Billing</span>
                            </Link>
                        </>
                    )}

                    {isAdmin && (
                        <Link
                            href="/dashboard/admin"
                            className={`${styles.navItem} ${pathname === '/dashboard/admin' ? styles.active : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <Shield size={20} color="#f43f5e" />
                            <span>Admin Panel</span>
                        </Link>
                    )}

                    <Link
                        href="/dashboard/settings"
                        className={`${styles.navItem} ${pathname === '/dashboard/settings' ? styles.active : ''}`}
                        onClick={() => setIsOpen(false)}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className={styles.footer}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>
                            {profile.fullName ? profile.fullName[0].toUpperCase() : <User size={16} />}
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{profile.fullName || user?.email?.split('@')[0] || 'User'}</span>
                            <span className={styles.userRole}>{isAdmin ? 'Admin' : (profile.plan || 'Free Plan')}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
