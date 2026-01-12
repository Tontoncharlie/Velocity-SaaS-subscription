"use client";
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}></div>
                    <span className={styles.logoText}>Velocity</span>
                </div>

                {/* Mobile Toggle */}
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X color="white" /> : <Menu color="white" />}
                </button>

                {/* Links - Active class added when open */}
                <div className={`${styles.links} ${isOpen ? styles.active : ''}`}>
                    <Link href="/#features" onClick={() => setIsOpen(false)}>Features</Link>
                    <Link href="/#pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
                    <Link href="/#about" onClick={() => setIsOpen(false)}>About</Link>

                    {/* Move Auth buttons here for mobile menu structure if needed, or keep separate */}
                    <div className={styles.mobileAuth}>
                        <Link href="/auth" className={styles.loginBtn}>Login</Link>
                        <Link href="/auth" className={styles.signupBtn}>Get Started</Link>
                    </div>
                </div>

                {/* Desktop Auth (Hidden on mobile usually, or integrated) */}
                <div className={styles.desktopAuth}>
                    <Link href="/auth" className={styles.loginBtn}>Login</Link>
                    <Link href="/auth" className={styles.signupBtn}>Get Started</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
