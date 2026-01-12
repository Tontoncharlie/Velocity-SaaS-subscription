"use client";
import React, { useState } from 'react';
import styles from './Pricing.module.css';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import dynamic from 'next/dynamic';
const PaystackButton = dynamic(() => import('react-paystack').then((mod) => mod.PaystackButton), { ssr: false });
import { useRouter } from 'next/navigation';

const plans = [
    {
        name: 'Starter',
        price: '0',
        description: 'Perfect for small projects and hobbyists.',
        features: ['Up to 3 projects', 'Basic analytics', 'Community support', '1GB Storage'],
        btnText: 'Start for free',
        highlight: false
    },
    {
        name: 'Pro',
        price: '29',
        description: 'Best for growing startups and teams.',
        features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '20GB Storage', 'Custom domains'],
        btnText: 'Get Started',
        highlight: true
    },
    {
        name: 'Enterprise',
        price: '99',
        description: 'Full power for large scale organizations.',
        features: ['Everything in Pro', 'Custom contracts', '24/7 Phone support', 'Unlimited storage', 'Dedicated manager'],
        btnText: 'Contact Sales',
        highlight: false
    }
];

const Pricing = () => {
    const { user, updateProfile, refreshProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSuccess = async (reference, planName) => {
        setLoading(true);
        try {
            const res = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference: reference.reference, userId: user?.id }),
            });
            const data = await res.json();

            if (data.success) {
                alert(`Payment successful! Welcome to ${planName}.`);
                alert(`Payment successful! Welcome to ${planName}.`);
                await refreshProfile();
                router.push('/dashboard');
            } else {
                alert('Payment verification failed: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Error verifying payment');
        } finally {
            setLoading(false);
        }
    };

    const getPaystackProps = (amount, planName) => ({
        email: user?.email,
        amount: amount * 100,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        text: loading ? "Processing..." : "Get Started",
        onSuccess: (ref) => handleSuccess(ref, planName),
        onClose: () => alert("Transaction cancelled"),
    });

    return (
        <section className={styles.pricing} id="pricing">
            <div className={styles.header}>
                <h2 className={styles.title}>Simple, Transparent <span className={styles.accent}>Pricing</span></h2>
                <p className={styles.subtitle}>Choose the plan that fits your growth.</p>
            </div>

            <div className={styles.grid}>
                {plans.map((plan, index) => (
                    <div key={index} className={`${styles.card} ${plan.highlight ? styles.highlight : ''}`}>
                        {plan.highlight && <div className={styles.popularTag}>Most Popular</div>}
                        <h3 className={styles.planName}>{plan.name}</h3>
                        <div className={styles.priceContainer}>
                            <span className={styles.currency}>$</span>
                            <span className={styles.price}>{plan.price}</span>
                            <span className={styles.period}>/month</span>
                        </div>
                        <p className={styles.planDesc}>{plan.description}</p>

                        {plan.price === '0' ? (
                            <Link href={user ? "/dashboard" : "/auth"} className={`${styles.planBtn} ${plan.highlight ? styles.primaryBtn : styles.secondaryBtn}`}>
                                {user ? "Go to Dashboard" : "Start for free"}
                            </Link>
                        ) : (
                            user ? (
                                <PaystackButton
                                    {...getPaystackProps(parseInt(plan.price) * 100, plan.name)}
                                    className={`${styles.planBtn} ${plan.highlight ? styles.primaryBtn : styles.secondaryBtn}`}
                                />
                            ) : (
                                <Link href="/auth" className={`${styles.planBtn} ${plan.highlight ? styles.primaryBtn : styles.secondaryBtn}`}>
                                    {plan.btnText}
                                </Link>
                            )
                        )}

                        <ul className={styles.featureList}>
                            {plan.features.map((feature, fIdx) => (
                                <li key={fIdx} className={styles.featureItem}>
                                    <Check size={18} className={styles.checkIcon} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Pricing;
