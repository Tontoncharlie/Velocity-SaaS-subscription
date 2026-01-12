"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CreditCard, Calendar, Shield, Activity, TrendingUp, Clock, Zap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, profile, updateProfile, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Redirect Admin to Admin Panel
    useEffect(() => {
        if (!authLoading && user) {
            const email = user.email.toLowerCase();
            if (email === 'admin@velocity.com' || email.includes('admin')) {
                router.push('/dashboard/admin');
            }
        }
    }, [user, authLoading, router]);

    // Handle Paystack Callback
    useEffect(() => {
        const handlePaymentSuccess = async () => {
            const params = new URLSearchParams(window.location.search);
            const reference = params.get('reference');

            if (reference && profile.plan !== 'Pro Plan') {
                console.log('Payment verified, upgrading user...');
                await updateProfile({ ...profile, plan: 'Pro Plan' });
                window.history.replaceState({}, document.title, '/dashboard');
                alert('Upgrade Successful! Welcome to Pro Plan.');
            }
            setLoading(false);
        };

        if (user) {
            handlePaymentSuccess();
        }
    }, [user]);

    const PLAN_LIMITS = {
        'Free Tier': { storage: '1GB', projects: 3 },
        'Free': { storage: '1GB', projects: 3 },
        'Pro Plan': { storage: '100GB', projects: 'Unlimited' },
        'Pro': { storage: '100GB', projects: 'Unlimited' },
        'Enterprise': { storage: 'Unlimited', projects: 'Unlimited' }
    };

    const currentLimit = PLAN_LIMITS[profile.plan] || PLAN_LIMITS['Free Tier'];
    const isPro = profile.plan === 'Pro' || profile.plan === 'Pro Plan';
    const isEnterprise = profile.plan === 'Enterprise';
    const isFree = !isPro && !isEnterprise;

    // Mock Next Payment calculation (30 days from now)
    const nextPaymentDate = new Date();
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
    const formattedDate = nextPaymentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const stats = [
        {
            label: 'Current Plan',
            value: profile.plan || 'Free Tier',
            icon: <Shield size={24} color="#6366f1" />,
            change: !isFree ? 'Active' : 'Upgrade',
            color: '#6366f1'
        },
        {
            label: 'Next Payment',
            value: !isFree ? formattedDate : 'N/A',
            icon: <Calendar size={24} color="#10b981" />,
            change: !isFree ? 'Auto-renew' : 'No active sub',
            color: '#10b981'
        },
        {
            label: 'Storage Used',
            value: `1.2GB / ${currentLimit.storage}`,
            icon: <Activity size={24} color="#f43f5e" />,
            change: isFree ? '120% Used' : isPro ? '1.2% Used' : '< 1% Used',
            color: '#f43f5e'
        },
        {
            label: 'Projects',
            value: `2 / ${currentLimit.projects}`,
            icon: <TrendingUp size={24} color="#8b5cf6" />,
            change: isFree ? '67% Used' : 'Unlimited',
            color: '#8b5cf6'
        },
    ];

    // Quick actions based on plan
    const quickActions = [
        {
            title: 'View Billing',
            description: 'Manage your subscription and payment details',
            icon: <CreditCard size={20} />,
            href: '/dashboard/billing',
            color: '#6366f1'
        },
        {
            title: 'Account Settings',
            description: 'Update your profile and preferences',
            icon: <Shield size={20} />,
            href: '/dashboard/settings',
            color: '#10b981'
        }
    ];

    // Recent activity (mock data)
    const recentActivity = [
        { action: 'Account created', time: 'Just now', icon: <CheckCircle2 size={16} color="#10b981" /> },
        { action: 'Profile updated', time: '2 hours ago', icon: <CheckCircle2 size={16} color="#10b981" /> },
        { action: 'Logged in', time: 'Today', icon: <Clock size={16} color="#6366f1" /> },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>
                    Welcome back, {profile.fullName || user?.email?.split('@')[0] || 'User'}! 👋
                </h1>
                <p style={{ color: 'var(--muted)' }}>
                    Here's an overview of your subscription and account activity.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((stat, index) => (
                    <div key={index} className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ padding: '0.75rem', background: `${stat.color}15`, borderRadius: '12px' }}>
                                {stat.icon}
                            </div>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '99px',
                                fontSize: '0.75rem',
                                background: stat.change.includes('Used') && isFree && stat.label === 'Storage Used'
                                    ? 'rgba(239,68,68,0.2)'
                                    : 'rgba(255,255,255,0.1)',
                                color: stat.change.includes('Used') && isFree && stat.label === 'Storage Used'
                                    ? '#ef4444'
                                    : 'var(--muted)',
                                fontWeight: '500'
                            }}>
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                {/* Quick Actions */}
                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={18} color="#f59e0b" /> Quick Actions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        padding: '0.5rem',
                                        background: `${action.color}20`,
                                        borderRadius: '8px',
                                        color: action.color
                                    }}>
                                        {action.icon}
                                    </div>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: '500', fontSize: '0.95rem' }}>{action.title}</div>
                                        <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{action.description}</div>
                                    </div>
                                </div>
                                <ArrowRight size={18} color="var(--muted)" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={18} color="#6366f1" /> Recent Activity
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '10px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {activity.icon}
                                    <span style={{ color: 'white', fontSize: '0.9rem' }}>{activity.action}</span>
                                </div>
                                <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upgrade Banner - Only for Free users */}
            {isFree && (
                <div
                    className="glass"
                    style={{
                        padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                        border: '1px solid rgba(99,102,241,0.3)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Sparkles size={20} color="#818cf8" />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>
                                    Upgrade to Pro
                                </h2>
                            </div>
                            <p style={{ color: 'var(--muted)', maxWidth: '500px' }}>
                                You're currently using 120% of your storage. Upgrade to Pro for 100GB storage,
                                unlimited projects, and priority support.
                            </p>
                        </div>
                        <Link
                            href="/dashboard/billing"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                borderRadius: '10px',
                                fontWeight: '600',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Upgrade Now <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            )}

            {/* Pro/Enterprise user welcome */}
            {!isFree && (
                <div
                    className="glass"
                    style={{
                        padding: '2rem',
                        background: isEnterprise
                            ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))'
                            : 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))',
                        border: isEnterprise
                            ? '1px solid rgba(245,158,11,0.3)'
                            : '1px solid rgba(16,185,129,0.3)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <CheckCircle2 size={32} color={isEnterprise ? '#f59e0b' : '#10b981'} />
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                                {isEnterprise ? 'Enterprise Member' : 'Pro Member'} ✨
                            </h2>
                            <p style={{ color: 'var(--muted)' }}>
                                Thank you for being a {profile.plan} subscriber. You have access to all {isEnterprise ? 'enterprise' : 'pro'} features.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
