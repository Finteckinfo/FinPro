import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { getCookie } from '@/utils/cookies';
import { supabase, isSupabaseOnly } from '@/services/supabase';

/**
 * Authentication Guard for FinPro
 * 
 * PERFORMANCE OPTIMIZED:
 * - Uses synchronous cookie/storage checks (no network calls)
 * - Network validation happens in background after page loads
 * - Instant navigation for authenticated users
 */

// PERFORMANCE: Synchronous session check - no network latency
function hasValidSession(): boolean {
  // SUPABASE-ONLY MODE: Check localStorage cache first (fast sync check)
  if (isSupabaseOnly) {
    try {
      const cached = localStorage.getItem('FinPro_session_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        const cacheAge = Date.now() - (parsed.timestamp || 0);
        if (cacheAge < 10 * 60 * 1000 && parsed.session) { // 10 min cache
          return true;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    // Check sessionStorage for Supabase auth
    try {
      const user = sessionStorage.getItem('erp_user');
      const token = sessionStorage.getItem('erp_session_token');
      const timestamp = sessionStorage.getItem('erp_auth_timestamp');

      if (user && token && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        if (age < maxAge) return true;
      }
    } catch (e) {
      // Ignore storage errors
    }

    // For Supabase-only mode, also check if we have a Supabase access token
    try {
      const supabaseAuth = localStorage.getItem('sb-' + import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
      if (supabaseAuth) {
        const parsed = JSON.parse(supabaseAuth);
        if (parsed?.access_token && parsed?.expires_at) {
          const expiresAt = new Date(parsed.expires_at * 1000);
          if (expiresAt > new Date()) return true;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    return false;
  }

  // Check cookies first (fastest) - for NextAuth mode
  const sessionToken = getCookie('next-auth.session-token') ||
    getCookie('__Secure-next-auth.session-token') ||
    getCookie('FinPro_sso_token');

  if (sessionToken) return true;

  // Check sessionStorage (SSO fallback)
  try {
    const user = sessionStorage.getItem('erp_user');
    const token = sessionStorage.getItem('erp_session_token');
    const timestamp = sessionStorage.getItem('erp_auth_timestamp');

    if (user && token && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (age < maxAge) return true;
    }
  } catch (e) {
    // Ignore storage errors
  }

  // Check localStorage cache
  try {
    const cached = localStorage.getItem('FinPro_session_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      const cacheAge = Date.now() - (parsed.timestamp || 0);
      if (cacheAge < 10 * 60 * 1000 && parsed.session) { // 10 min cache
        return true;
      }
    }
  } catch (e) {
    // Ignore storage errors
  }

  return false;
}

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth-loading',
    '/unauthorized',
    '/error',
    '/login',
    '/register'
  ];

  // Check if current route is public
  if (publicRoutes.includes(to.path)) {
    return next();
  }

  // WALLET-ONLY AUTH: Check sessionStorage for wallet connection
  // This matches logic in useEVMWallet
  try {
    const isConnected = sessionStorage.getItem('FinPro_wallet_connected') === 'true';
    const hasAddress = !!sessionStorage.getItem('FinPro_wallet_address');

    if (isConnected && hasAddress) {
      return next();
    }
  } catch (e) {
    // Ignore errors
  }

  // No wallet connection found - redirect to login
  console.log('[AuthGuard] No wallet connection, redirecting to login');

  // Store intended destination for post-auth redirect
  try {
    sessionStorage.setItem('post_auth_redirect', to.fullPath);
  } catch (error) {
    // Ignore storage errors
  }

  return next('/login');
}

/**
 * Helper function to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const isConnected = sessionStorage.getItem('FinPro_wallet_connected') === 'true';
    const hasAddress = !!sessionStorage.getItem('FinPro_wallet_address');
    return isConnected && hasAddress;
  } catch (error) {
    return false;
  }
}

/**
 * Helper function to get stored redirect destination
 */
export function getPostAuthRedirect(): string | null {
  try {
    const redirect = sessionStorage.getItem('post_auth_redirect');
    if (redirect && redirect !== '/auth-loading') {
      return redirect;
    }
  } catch (error) {
    console.warn('Unable to retrieve redirect destination:', error);
  }
  return null;
}

/**
 * Helper function to clear stored redirect destination
 */
export function clearPostAuthRedirect(): void {
  try {
    sessionStorage.removeItem('post_auth_redirect');
  } catch (error) {
    console.warn('Unable to clear redirect destination:', error);
  }
}
