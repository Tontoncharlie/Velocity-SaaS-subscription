"use client";
import React from 'react';
import styles from './Features.module.css';
import { Zap, Shield, BarChart3, Globe, Layers, Users } from 'lucide-react';

const features = [
    {
        icon: <Zap size={32} />,
        title: 'Lightning Fast',
        description: 'Optimized for speed. Our platform ensures your data is always available in milliseconds.'
    },
    {
        icon: <Shield size={32} />,
        title: 'Bank-Grade Security',
        description: 'We use the latest encryption standards to keep your business and customer data safe.'
    },
    {
        icon: <BarChart3 size={32} />,
        title: 'Advanced Analytics',
        description: 'Gain deep insights into your subscription metrics with our real-time dashboard.'
    },
    {
        icon: <Globe size={32} />,
        title: 'Global Payments',
        description: 'Accept payments from anywhere in the world with built-in multi-currency support.'
    },
    {
        icon: <Layers size={32} />,
        title: 'Seamless Integration',
        description: 'Connect with your favorite tools. We support Webhooks, Zapier, and a robust API.'
    },
    {
        icon: <Users size={32} />,
        title: 'Team Collaboration',
        description: 'Built for teams. Invite members, assign roles, and manage permissions effortlessly.'
    }
];

const Features = () => {
    return (
        <section id="features" className={styles.features}>
            <div className={styles.header}>
                <span className={styles.badge}>Features</span>
                <h2 className={styles.title}>Everything you need to <span className={styles.gradientText}>scale</span></h2>
                <p className={styles.subtitle}>Powerful tools to help you build better products.</p>
            </div>

            <div className={styles.grid}>
                {features.map((feature, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.iconWrapper}>
                            {feature.icon}
                        </div>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDesc}>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
