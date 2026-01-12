"use client";
import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Check, HardDrive, Folder, Zap, Crown, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
const PaystackButton = dynamic(() => import('react-paystack').then((mod) => mod.PaystackButton), { ssr: false });

export default function BillingPage() {
    const { user, profile, updateProfile, refreshProfile } = useAuth();
    // Track loading state per plan
    const [loadingPlan, setLoadingPlan] = React.useState(null); // 'Pro' | 'Enterprise' | null

    const isPro = profile.plan === 'Pro' || profile.plan === 'Pro Plan';
    const isEnterprise = profile.plan === 'Enterprise';
    const isFree = !isPro && !isEnterprise;

    const handleSuccess = async (reference, plan) => {
        setLoadingPlan(plan);
        try {
            const res = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference: reference.reference, userId: user?.id }),
            });
            const data = await res.json();

            if (data.success) {
                // Immediately update the profile state so UI reflects the change
                await updateProfile({ plan: data.plan || plan });
                alert(`Payment successful! Welcome to ${plan}.`);
            } else {
                alert('Payment verification failed: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Error verifying payment');
        } finally {
            setLoadingPlan(null);
        }
    };

    const componentProps = (amount, plan) => ({
        email: user?.email,
        amount: amount * 100,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        text: loadingPlan === plan ? "Processing..." : "Upgrade Now",
        onSuccess: (ref) => handleSuccess(ref, plan),
        onClose: () => alert("Transaction was not completed, window closed."),
    });

    if (!user) return <div style={{ color: 'white', padding: '2rem' }}>Please log in to manage billing.</div>;

    const plans = [
        {
            name: 'Free',
            price: '₦0',
            period: '/forever',
            storage: '1GB',
            projects: '3 Projects',
            description: 'Perfect for getting started',
            features: [
                '1GB Storage',
                '3 Projects',
                'Basic Support',
                'Community Access'
            ],
            icon: <Sparkles size={24} />,
            gradient: 'linear-gradient(135deg, rgba(148,163,184,0.2), rgba(100,116,139,0.1))',
            borderColor: 'rgba(148,163,184,0.3)',
            isCurrent: isFree,
            buttonDisabled: true,
            buttonText: isFree ? 'Current Plan' : 'Downgrade'
        },
        {
            name: 'Pro',
            price: '₦2,900',
            period: '/month',
            storage: '100GB',
            projects: 'Unlimited',
            description: 'Best for professionals',
            features: [
                '100GB Storage',
                'Unlimited Projects',
                'Priority Support',
                'Advanced Analytics',
                'API Access'
            ],
            icon: <Zap size={24} />,
            gradient: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
            borderColor: 'rgba(99,102,241,0.5)',
            highlight: true,
            isCurrent: isPro,
            amount: 2900
        },
        {
            name: 'Enterprise',
            price: '₦9,900',
            period: '/month',
            storage: 'Unlimited',
            projects: 'Unlimited',
            description: 'For large organizations',
            features: [
                'Unlimited Storage',
                'Unlimited Projects',
                '24/7 Dedicated Support',
                'Custom Integrations',
                'SLA Guarantee',
                'Team Management'
            ],
            icon: <Crown size={24} />,
            gradient: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(251,191,36,0.2))',
            borderColor: 'rgba(245,158,11,0.5)',
            isCurrent: isEnterprise,
            amount: 9900
        }
    ];

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>
                Subscription & Billing
            </h1>
            <p style={{ color: 'var(--muted)', marginBottom: '3rem' }}>
                Choose the perfect plan for your needs.
            </p>

            {/* Current Plan Banner */}
            <div
                className="glass"
                style={{
                    padding: '1.5rem 2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}
            >
                <div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        Your current plan
                    </div>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {profile.plan || 'Free Tier'}
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(16,185,129,0.2)',
                            color: '#10b981',
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>Active</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                        <HardDrive size={20} color="var(--primary)" style={{ marginBottom: '0.25rem' }} />
                        <div style={{ color: 'white', fontWeight: '600' }}>
                            {isPro ? '100GB' : isEnterprise ? 'Unlimited' : '1GB'}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Storage</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Folder size={20} color="#10b981" style={{ marginBottom: '0.25rem' }} />
                        <div style={{ color: 'white', fontWeight: '600' }}>
                            {isFree ? '3' : 'Unlimited'}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Projects</div>
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        style={{
                            background: plan.gradient,
                            border: `1px solid ${plan.borderColor}`,
                            borderRadius: '16px',
                            padding: '2rem',
                            position: 'relative',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            transform: plan.highlight ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: plan.highlight ? '0 20px 40px rgba(99,102,241,0.2)' : 'none'
                        }}
                    >
                        {plan.highlight && (
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                padding: '0.25rem 1rem',
                                borderRadius: '99px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                Most Popular
                            </div>
                        )}

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: plan.highlight ? '#818cf8' : plan.name === 'Enterprise' ? '#fbbf24' : 'var(--muted)'
                            }}>
                                {plan.icon}
                            </div>
                            <div>
                                <h3 style={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>
                                    {plan.name}
                                </h3>
                                <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                                    {plan.description}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                                {plan.price}
                            </span>
                            <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                                {plan.period}
                            </span>
                        </div>

                        {/* Storage Highlight */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
                                    {plan.storage}
                                </div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Storage</div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
                                    {plan.projects}
                                </div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Projects</div>
                            </div>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                            {plan.features.map((feature, i) => (
                                <li key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--muted)',
                                    fontSize: '0.9rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <Check size={16} color="#10b981" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {plan.isCurrent ? (
                            <button
                                disabled
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(16,185,129,0.2)',
                                    color: '#10b981',
                                    border: '1px solid rgba(16,185,129,0.3)',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    cursor: 'not-allowed'
                                }}
                            >
                                Current Plan ✓
                            </button>
                        ) : plan.buttonDisabled ? (
                            <button
                                disabled
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--muted)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    cursor: 'not-allowed'
                                }}
                            >
                                {plan.buttonText}
                            </button>
                        ) : (
                            <PaystackButton
                                {...componentProps(plan.amount, plan.name)}
                                className={`paystack-button ${plan.name === 'Enterprise' ? 'paystack-button-enterprise' : ''}`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="glass" style={{ padding: '2rem' }}>
                <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem' }}>
                    Frequently Asked Questions
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <div style={{ color: 'white', fontWeight: '500', marginBottom: '0.25rem' }}>
                            Can I upgrade or downgrade anytime?
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                            Yes! You can change your plan at any time. Upgrades take effect immediately.
                        </div>
                    </div>
                    <div>
                        <div style={{ color: 'white', fontWeight: '500', marginBottom: '0.25rem' }}>
                            What payment methods do you accept?
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                            We accept all major cards, bank transfers, and mobile money via Paystack.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
