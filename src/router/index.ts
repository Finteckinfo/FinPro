import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useMetaMaskWallet } from '@/composables/useMetaMaskWallet';

// MetaMask Wallet Authentication
const { isConnected, user } = useMetaMaskWallet();

// Dev bypass (for headless testing / no MetaMask)
const DEV_BYPASS_AUTH = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

// Check for wallet connection
function hasWalletConnection(): boolean {
  if (DEV_BYPASS_AUTH) return true;
  return isConnected.value && !!user.value?.address;
}

// Handle GitHub Pages SPA routing
// https://github.com/rafgraph/spa-github-pages
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:pathMatch(.*)*', component: () => import('@/views/pages/maintenance/error/Error404Page.vue') },
    { path: '/sso-callback', component: () => import('@/views/authentication/SSOCallback.vue') },
    { path: '/auth-loading', component: () => import('@/views/pages/maintenance/AuthLoadingPage.vue') },
    MainRoutes,
    PublicRoutes
  ]
});

// Handle GitHub Pages SPA routing redirect
if (typeof window !== 'undefined') {
  // Check if we're on GitHub Pages and have a redirect query parameter
  const l = window.location;
  const pathSegmentsToKeep = 1; // For /FinERP/ repository

  if (l.search.startsWith('?/')) {
    const path = l.search.slice(2).replace(/~and~/g, '&');
    window.history.replaceState(null, '', l.pathname.slice(0, -1) + path + l.hash);
  }
}

export { router };

router.beforeEach(async (to, from, next) => {
  // Skip loading page to avoid infinite loop
  if (to.path === '/auth-loading') {
    next();
    return;
  }

  const publicPages = ['/login', '/register', '/error'];
  const isPublicPage = publicPages.includes(to.path);
  const authRequired = !isPublicPage && to.matched.some((record) => record.meta.requiresAuth);

  // Check for wallet connection
  const hasWallet = hasWalletConnection();

  if (authRequired) {
    if (hasWallet) {
      // Wallet connected, proceed
      console.log('[Router] Wallet connected, allowing access');
      next();
    } else {
      // No wallet connection, redirect to landing page
      console.log('[Router] No wallet connection, redirecting to landing page');
      next('/');
    }
  } else if (hasWallet && (to.path === '/')) {
    // User has wallet connected and is on landing page, redirect to dashboard
    next('/dashboard');
  } else {
    next();
  }
});
