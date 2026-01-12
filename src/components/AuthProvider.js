"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({ fullName: '', phone: '', plan: 'Free Tier' });
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (sessionUser) => {
        if (!sessionUser) {
            setProfile({ fullName: '', phone: '', plan: 'Free Tier' });
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', sessionUser.id)
                .maybeSingle();

            if (error) {
                console.warn('Error fetching profile:', error);
            }

            if (!data) {
                // Fallback to metadata if profile missing
                const meta = sessionUser.user_metadata || {};
                setProfile({
                    fullName: meta.full_name || '',
                    phone: meta.phone || '',
                    plan: 'Free Tier'
                });
            } else {
                setProfile({
                    fullName: data.full_name || '',
                    phone: data.phone || '',
                    plan: data.plan || 'Free Tier'
                });
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
        }
    };

    useEffect(() => {
        async function getSession() {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    throw error;
                }
                setUser(session?.user ?? null);
                await fetchProfile(session?.user);
            } catch (error) {
                console.error('Error getting session:', error);
            } finally {
                setLoading(false);
            }
        }

        getSession();

        // Safety timeout
        const timeoutId = setTimeout(() => {
            setLoading(prev => {
                if (prev) return false;
                return prev;
            });
        }, 2000);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
                await fetchProfile(session?.user);
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const updateProfile = async (newProfile) => {
        console.log('updateProfile called with:', newProfile);

        try {
            if (!user) {
                console.error('No user found');
                return { success: false, error: 'No user' };
            }

            // Build update data
            const updateData = {
                full_name: newProfile.fullName !== undefined ? newProfile.fullName : profile.fullName,
                phone: newProfile.phone !== undefined ? newProfile.phone : profile.phone,
                plan: newProfile.plan || profile.plan || 'Free Tier',
                status: 'Active'
            };

            console.log('Updating profile with:', updateData);

            // Use upsert to handle both insert and update cases
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    ...updateData
                }, { onConflict: 'id' });

            if (error) {
                console.error('Upsert error:', error);
                throw error;
            }

            console.log('Profile saved successfully.');

            // Update local state immediately (don't wait for refetch)
            setProfile(prev => ({
                ...prev,
                fullName: updateData.full_name,
                phone: updateData.phone,
                plan: updateData.plan
            }));

            // Auth metadata update in background (don't await)
            supabase.auth.updateUser({
                data: {
                    full_name: updateData.full_name,
                    phone: updateData.phone,
                    current_plan: updateData.plan
                }
            }).catch(err => console.warn('Auth metadata sync failed:', err));

            return { success: true };
        } catch (error) {
            console.error('Error in updateProfile:', error);
            return { success: false, error: error.message || error };
        }
    };

    const refreshProfile = async () => {
        if (user) await fetchProfile(user);
    };

    return (
        <AuthContext.Provider value={{ user, profile, updateProfile, refreshProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
