"use client";
import React from 'react';
import styles from './Hero.module.css';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={styles.content}
            >
                <span className={styles.badge}>Next Generation SaaS</span>
                <h1 className={styles.title}>
                    Elevate Your <span className={styles.gradientText}>Business Strategy</span>
                </h1>
                <p className={styles.description}>
                    The complete platform for subscription management, user engagement, and data-driven growth. Scalable for any size.
                </p>
                <div className={styles.ctaGroup}>
                    <button className={styles.primaryBtn}>Start Free Trial</button>
                    <button className={styles.secondaryBtn}>Schedule Demo</button>
                </div>
            </motion.div>
            <div className={styles.backgroundGlow}></div>
        </section>
    );
};

export default Hero;
