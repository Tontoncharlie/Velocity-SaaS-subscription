"use client";
import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Protect route: redirect to dashboard if not admin
    React.useEffect(() => {
        if (!loading && (!user || (user.email !== 'admin@velocity.com' && !user.email.includes('admin')))) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;

    const [profiles, setProfiles] = React.useState([]);
    const [statsData, setStatsData] = React.useState({
        revenue: 0,
        subscribers: 0,
        churn: 2.4 // Mock for now
    });

    // Fetch profiles
    React.useEffect(() => {
        async function fetchProfiles() {
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching profiles:', error);
            } else if (data) {
                setProfiles(data);

                // Calculate stats
                const activeSubs = data.filter(p => p.plan !== 'Free Tier' && p.plan !== 'Starter').length;
                // simple revenue calc assumption: Pro = 29, Ent = 99. 
                // In reality, you'd sum up actual payments table, but for now specific plans:
                const revenue = data.reduce((acc, curr) => {
                    if (curr.plan === 'Pro') return acc + 29;
                    if (curr.plan === 'Enterprise') return acc + 99;
                    return acc;
                }, 0);

                setStatsData(prev => ({
                    ...prev,
                    revenue: revenue,
                    subscribers: activeSubs
                }));
            }
        }
        fetchProfiles();
    }, [user]);

    const stats = [
        { label: 'Total Revenue', value: `$ ${statsData.revenue}`, change: '+12%', icon: <DollarSign size={24} color="#10b981" /> },
        { label: 'Active Subscribers', value: statsData.subscribers.toString(), change: '+5%', icon: <Users size={24} color="#6366f1" /> },
        { label: 'Churn Rate', value: '2.4%', change: '-0.5%', icon: <TrendingUp size={24} color="#f43f5e" /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <div style={{ padding: '2rem', width: '100%' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: 'white' }}>Admin Dashboard</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                    {stat.icon}
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    background: stat.change.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                                    color: stat.change.startsWith('+') ? '#10b981' : '#f43f5e'
                                }}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{stat.label}</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white' }}>{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>User Subscriptions</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--muted)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem 0' }}>User</th>
                                <th style={{ padding: '1rem 0' }}>Plan</th>
                                <th style={{ padding: '1rem 0' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.length > 0 ? (
                                profiles.map((profile) => (
                                    <tr key={profile.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem 0', color: 'white' }}>{profile.email}</td>
                                        <td>{profile.plan}</td>
                                        <td style={{ color: profile.plan === 'Free Tier' ? '#9ca3af' : '#10b981' }}>
                                            {profile.status || 'Active'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ padding: '1rem 0', textAlign: 'center' }}>No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
