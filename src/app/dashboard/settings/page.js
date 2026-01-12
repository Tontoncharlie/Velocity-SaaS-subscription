"use client";
import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Save, Check } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function SettingsPage() {
    const { user, profile, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

    // Local state for the form, initialized with global state
    const [formData, setFormData] = useState({
        fullName: profile.fullName || '',
        phone: profile.phone || ''
    });

    // Keep local state in sync if global profile updates
    useEffect(() => {
        setFormData({
            fullName: profile.fullName || '',
            phone: profile.phone || ''
        });
    }, [profile.fullName, profile.phone]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSaveStatus(null);

        try {
            const result = await updateProfile(formData);

            if (result.success) {
                setSaveStatus('success');
                // Clear success message after 3 seconds
                setTimeout(() => setSaveStatus(null), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white' }}>Settings</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '3rem' }}>Manage your account and preferences.</p>

            <div className="glass" style={{ padding: '2rem', maxWidth: '800px' }}>

                {/* Profile Section */}
                <section style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                        <User size={20} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>Profile Information</h2>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="John Doe"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+234..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--muted)', cursor: 'not-allowed' }}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Email cannot be changed.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                width: 'fit-content', padding: '0.75rem 1.5rem',
                                background: saveStatus === 'success' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : 'var(--primary)',
                                color: 'white', border: 'none', borderRadius: '8px',
                                fontWeight: '600', cursor: loading ? 'wait' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {saveStatus === 'success' ? <Check size={18} /> : <Save size={18} />}
                            {loading ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Failed' : 'Save Changes'}
                        </button>
                    </form>
                </section>

                {/* Notifications Mock */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                        <Bell size={20} color="var(--secondary)" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>Notifications</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <div>
                                <div style={{ color: 'white', fontWeight: '500' }}>Email Notifications</div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Receive updates about your subscription</div>
                            </div>
                            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)', width: '1.2rem', height: '1.2rem' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <div>
                                <div style={{ color: 'white', fontWeight: '500' }}>Security Alerts</div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Get notified about login attempts</div>
                            </div>
                            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)', width: '1.2rem', height: '1.2rem' }} />
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
