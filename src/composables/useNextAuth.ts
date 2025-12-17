import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

export interface NextAuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  walletAddress?: string;
  authMethod?: string;
}

export interface NextAuthSession {
  user: NextAuthUser;
  expires: string;
}

/**
 * Compatibility layer: useNextAuth now proxies to useAuthStore (EVM Wallet)
 * This ensures strict EVM-only auth while keeping legacy components working.
 */
export function useNextAuth() {
  const authStore = useAuthStore();

  const isLoaded = computed(() => authStore.initialized);
  const isSignedIn = computed(() => authStore.isAuthenticated);

  const user = computed<NextAuthUser | null>(() => {
    if (!authStore.user) return null;

    // Map EVM wallet user to NextAuth user format
    return {
      id: authStore.user.address, // Use wallet address as ID
      email: `${authStore.user.address}@wallet.connect`, // Mock email for compatibility
      name: authStore.profile.name,
      firstName: 'Wallet',
      lastName: 'User',
      image: authStore.profile.avatar || undefined,
      walletAddress: authStore.user.address,
      authMethod: 'evm_wallet'
    };
  });

  const session = computed<NextAuthSession | null>(() => {
    if (!user.value) return null;
    return {
      user: user.value,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Mock expiry
    };
  });

  const validateSession = async (force = false) => {
    // No-op: Auth state is managed by useEVMWallet / authStore
    await authStore.initialize();
  };

  const clearSession = () => {
    authStore.signOut();
  };

  return {
    isLoaded,
    isSignedIn,
    user,
    session,
    validateSession,
    clearSession,
  };
}
