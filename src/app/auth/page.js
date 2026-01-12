"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './Auth.module.css';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const router = useRouter();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (email.toLowerCase().includes('admin')) {
                    router.push('/dashboard/admin');
                } else {
                    router.push('/dashboard');
                }
            } else {
                const { data: { user }, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                // Create profile in profiles table
                if (user) {
                    await supabase.from('profiles').insert([
                        {
                            id: user.id,
                            email: user.email,
                            full_name: '',
                            plan: 'Free Tier',
                            status: 'Active'
                        }
                    ]);
                }

                // Redirect to dashboard after successful signup
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className={styles.subtitle}>
                        {isLogin ? 'Enter your credentials to access your account' : 'Start your journey with us today'}
                    </p>
                </div>

                {error && <div className={styles.error}>{error}</div>}
                {successMessage && <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                }}>{successMessage}</div>}

                <form onSubmit={handleAuth} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <Mail className={styles.icon} size={20} />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <Lock className={styles.icon} size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? <Loader2 className={styles.spinner} /> : (
                            <>
                                {isLogin ? 'Sign In' : 'Sign Up'}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <div>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className={styles.toggleBtn}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
