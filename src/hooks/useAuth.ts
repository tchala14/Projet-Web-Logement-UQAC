import { useState, useEffect } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase/client';
import { AuthUser } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: (session.user.user_metadata?.role as 'owner' | 'admin') || 'owner',
          full_name: session.user.user_metadata?.full_name,
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: (session.user.user_metadata?.role as 'owner' | 'admin') || 'owner',
          full_name: session.user.user_metadata?.full_name,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string, role: 'owner' | 'admin' = 'owner') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          phone: phone || null,
        },
      },
    });

    if (error) {
      return { data, error };
    }

    // Create owner record manually (the trigger might not work in all cases)
    if (data.user && role === 'owner') {
      try {
        const { error: ownerError } = await supabase
          .from('owners')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            phone: phone || null,
            is_active: true,
          });

        if (ownerError) {
          console.error('Error creating owner record:', ownerError);
          // Don't fail the signup if the owner record creation fails
          // The trigger might have already created it
        }
      } catch (err) {
        console.error('Exception creating owner record:', err);
      }
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/proprietaires/reset-password`,
    });
    return { data, error };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOwner: user?.role === 'owner',
  };
}