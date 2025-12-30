import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

// Extend Window interface for Telegram WebApp
declare global {
    interface Window {
        Telegram?: {
            WebApp: any;
        };
    }
}

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
}

export interface TelegramAuthData {
    user: TelegramUser | null;
    isReady: boolean;
    isTelegramEnv: boolean;
}

/**
 * Hook to authenticate and get Telegram user data
 * Works both in Telegram Mini App and regular web browser
 */
export function useTelegramAuth(): TelegramAuthData {
    const [authData, setAuthData] = useState<TelegramAuthData>({
        user: null,
        isReady: false,
        isTelegramEnv: false,
    });

    useEffect(() => {
        // Check if running in Telegram environment
        const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp;

        if (isTelegram) {
            try {
                // Initialize Telegram WebApp
                WebApp.ready();

                // Get user data from Telegram
                const tgUser = WebApp.initDataUnsafe?.user;

                if (tgUser) {
                    setAuthData({
                        user: {
                            id: tgUser.id,
                            first_name: tgUser.first_name,
                            last_name: tgUser.last_name,
                            username: tgUser.username,
                            language_code: tgUser.language_code,
                            is_premium: tgUser.is_premium,
                        },
                        isReady: true,
                        isTelegramEnv: true,
                    });

                    // Expand the app to full height
                    WebApp.expand();

                    // Enable closing confirmation
                    WebApp.enableClosingConfirmation();
                } else {
                    setAuthData({
                        user: null,
                        isReady: true,
                        isTelegramEnv: true,
                    });
                }
            } catch (error) {
                console.error('Error initializing Telegram WebApp:', error);
                setAuthData({
                    user: null,
                    isReady: true,
                    isTelegramEnv: false,
                });
            }
        } else {
            // Not in Telegram environment
            setAuthData({
                user: null,
                isReady: true,
                isTelegramEnv: false,
            });
        }
    }, []);

    return authData;
}

/**
 * Hook to link Telegram user with wallet address in database
 */
export function useTelegramUserSync(
    telegramUser: TelegramUser | null,
    evmAddress: string | null,
    tonAddress: string | null
) {
    const [synced, setSynced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const syncUser = async () => {
        if (!telegramUser) return;
        // Don't sync if neither wallet is connected
        if (!evmAddress && !tonAddress) return;

        setLoading(true);
        setError(null);

        try {
            const { supabase } = await import('@/react-app/lib/supabase');
            const normalizedEvm = evmAddress?.toLowerCase() || null;
            // TON addresses are case-sensitive usually, but for safe lookup we store as provided
            const normalizedTon = tonAddress || null;

            // Check if Telegram user already exists
            const { data: existing } = await supabase
                .from('telegram_users')
                .select('*')
                .eq('telegram_id', telegramUser.id)
                .maybeSingle();

            if (!existing) {
                // Create new Telegram user record
                // Note: user_id is NOT NULL constraint reference to users table (EVM address)
                // If EVM address is missing, we might fail constraint if table requires user_id.
                // Assuming user_id maps to EVM address based on current architecture.

                if (normalizedEvm) {
                    const { error: insertError } = await supabase
                        .from('telegram_users')
                        .insert({
                            telegram_id: telegramUser.id,
                            telegram_username: telegramUser.username,
                            telegram_first_name: telegramUser.first_name,
                            telegram_last_name: telegramUser.last_name,
                            user_id: normalizedEvm,
                            ton_wallet_address: normalizedTon,
                            role: 'assignee', // Default role
                        });
                    if (insertError) throw insertError;
                } else {
                    console.warn('Skipping Telegram sync: EVM address required for initial creation (FK constraint)');
                }
            } else {
                // Update existing record
                const updates: any = {};
                if (normalizedEvm && existing.user_id !== normalizedEvm) {
                    updates.user_id = normalizedEvm;
                }
                if (normalizedTon && existing.ton_wallet_address !== normalizedTon) {
                    updates.ton_wallet_address = normalizedTon;
                }

                if (Object.keys(updates).length > 0) {
                    const { error: updateError } = await supabase
                        .from('telegram_users')
                        .update(updates)
                        .eq('telegram_id', telegramUser.id);

                    if (updateError) throw updateError;
                }
            }

            setSynced(true);
        } catch (err) {
            console.error('Error syncing Telegram user:', err);
            setError(err instanceof Error ? err.message : 'Failed to sync user');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (telegramUser && (evmAddress || tonAddress)) {
            syncUser();
        }
    }, [telegramUser, evmAddress, tonAddress]);

    return { synced, loading, error, syncUser };
}
/**
 * Get user role from Telegram users table
 */
export async function getTelegramUserRole(telegramId: number): Promise<'admin' | 'assignee' | null> {
    try {
        const { supabase } = await import('@/react-app/lib/supabase');

        const { data, error } = await supabase
            .from('telegram_users')
            .select('role')
            .eq('telegram_id', telegramId)
            .single();

        if (error) throw error;
        return data?.role as 'admin' | 'assignee' | null;
    } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
}
