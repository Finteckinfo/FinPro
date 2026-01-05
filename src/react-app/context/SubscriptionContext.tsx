import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/react-app/lib/supabase';
import { useWallet } from './WalletContext';

export interface SubscriptionTier {
    id: string;
    name: string;
    price_monthly: number;
    max_projects: number | null;
    features: {
        analytics: boolean;
        support: string;
        branding: string | boolean;
        api_access?: boolean;
        priority_queue?: boolean;
        white_label?: boolean;
    };
}

export interface UserSubscription {
    user_id: string;
    tier_id: string;
    tier_name: string;
    max_projects: number | null;
    features: any;
    expires_at: string | null;
}

interface SubscriptionContextType {
    subscription: UserSubscription | null;
    loading: boolean;
    error: string | null;
    refreshSubscription: () => Promise<void>;
    checkProjectLimit: () => Promise<boolean>;
    hasFeature: (featureKey: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const { account } = useWallet();
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshSubscription = useCallback(async () => {
        if (!account) {
            setSubscription(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error: rpcError } = await supabase.rpc('get_user_subscription', {
                p_user_id: account.toLowerCase()
            });

            if (rpcError) throw rpcError;

            if (data && data.length > 0) {
                setSubscription({ ...data[0], user_id: account.toLowerCase() });
            } else {
                // Should default to free tier via SQL function, but fallback here just in case
                setSubscription({
                    user_id: account.toLowerCase(),
                    tier_id: 'free',
                    tier_name: 'Free',
                    max_projects: 3,
                    features: { analytics: false, support: 'community', branding: false },
                    expires_at: null
                });
            }
        } catch (err: any) {
            console.error('Error fetching subscription:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [account]);

    const checkProjectLimit = useCallback(async () => {
        if (!account) return false;
        try {
            const { data, error: rpcError } = await supabase.rpc('can_create_project', {
                p_user_id: account.toLowerCase()
            });
            if (rpcError) throw rpcError;
            return !!data;
        } catch (err) {
            console.error('Error checking project limit:', err);
            return false;
        }
    }, [account]);

    const hasFeature = useCallback((featureKey: string) => {
        if (!subscription || !subscription.features) return false;
        return !!subscription.features[featureKey];
    }, [subscription]);

    useEffect(() => {
        refreshSubscription();
    }, [refreshSubscription]);

    const value = React.useMemo(() => ({
        subscription,
        loading,
        error,
        refreshSubscription,
        checkProjectLimit,
        hasFeature
    }), [subscription, loading, error, refreshSubscription, checkProjectLimit, hasFeature]);

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}
