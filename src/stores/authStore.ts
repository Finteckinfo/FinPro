import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useEVMWallet } from '@/composables/useEVMWallet';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const { user: walletUser, isConnected: isWalletConnected, disconnect: disconnectWallet, connect: connectWallet } = useEVMWallet();

    // State
    const loading = ref(false);
    const initialized = ref(false);

    // Computed
    // Authentication now depends strictly on wallet connection
    const isAuthenticated = computed(() => isWalletConnected.value && !!walletUser.value);

    // User display info derived from wallet
    const userDisplayName = computed(() => {
        if (!walletUser.value?.address) return 'Guest';
        const addr = walletUser.value.address;
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    });

    // Unified Profile Data
    const profile = computed(() => ({
        name: userDisplayName.value,
        email: null, // No email in wallet-only mode
        avatar: null, // Could use blockie/jazzicon here if needed
        walletAddress: walletUser.value?.address || null,
        walletBalance: walletUser.value?.balance || null,
        walletConnected: isWalletConnected.value
    }));

    // Actions
    async function initialize() {
        if (initialized.value) return;
        // Wallet state is reactive from useEVMWallet, so we just mark initialized
        initialized.value = true;
    }

    async function signIn() {
        loading.value = true;
        try {
            const success = await connectWallet();
            if (success) {
                // Determine redirect path
                const redirectPath = sessionStorage.getItem('post_auth_redirect') || '/dashboard/default';
                sessionStorage.removeItem('post_auth_redirect');

                if (router) {
                    router.push(redirectPath);
                } else {
                    window.location.href = redirectPath;
                }
            }
        } catch (error) {
            console.error('[AuthStore] Sign in error:', error);
        } finally {
            loading.value = false;
        }
    }

    async function signOut() {
        loading.value = true;
        try {
            await disconnectWallet();

            // Clear all auth-related storage
            sessionStorage.clear();
            localStorage.removeItem('FinPro_wallet_connected');

            if (router) {
                router.push('/login');
            } else {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('[AuthStore] Sign out error:', error);
        } finally {
            loading.value = false;
        }
    }

    return {
        // State
        loading,
        initialized,

        // Computed
        isAuthenticated,
        profile,
        user: walletUser, // Expose wallet user as main user

        // Actions
        initialize,
        signIn,
        signOut,
        connectWallet
    };
});
