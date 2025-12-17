<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/composables/useTheme';
import ThemeToggle from '@/components/shared/ThemeToggle.vue';
import Logo from '@/assets/images/logos/Logo.vue';

const router = useRouter();
const authStore = useAuthStore();
const { isDark } = useTheme();

const error = ref('');
const loading = ref(false);

const handleWalletLogin = async () => {
    loading.value = true;
    error.value = '';
    
    try {
        await authStore.signIn();
        // Redirect handled inside authStore upon success
    } catch (err: any) {
        console.error('Wallet login failed:', err);
        error.value = err.message || 'Failed to connect wallet';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    // If already authenticated, redirect
    if (authStore.isAuthenticated) {
        router.push('/dashboard/default');
    }
});
</script>

<template>
  <div :class="{ 'dark-theme': isDark }" class="login-page">
    <!-- Theme Toggle -->
    <div class="theme-toggle-container">
      <ThemeToggle :show-label="false" size="small" />
    </div>
    
    <div class="login-container">
      <!-- Left Side - Banner -->
      <div class="banner-column">
        <div class="banner-box">
          <div class="banner-overlay">
            <div class="banner-content">
              <h2 class="banner-title">
                Execute. Organize. <span class="accent-text">Collaborate.</span>
              </h2>
              <h3 class="banner-subtitle">
                Access the decentralized ecosystem with your wallet. Secure, private, and seamless project management.
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Wallet Auth -->
      <div class="form-column">
        <div class="form-container">
          <div class="logo-section">
            <Logo />
          </div>

          <div class="form-header">
            <h1 class="form-title">Welcome to FinPro</h1>
            <p class="form-subtitle">Connect your wallet to access the dashboard</p>
          </div>

          <!-- Error Message -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="error = ''"
          >
            {{ error }}
          </v-alert>

          <!-- Wallet Connect Action -->
          <div class="wallet-action-container">
            <v-btn
              size="x-large"
              block
              :loading="loading"
              :disabled="loading"
              class="wallet-button"
              color="primary"
              @click="handleWalletLogin"
            >
              <v-icon start icon="mdi-wallet" class="mr-2"></v-icon>
              Connect Wallet
            </v-btn>
            
            <p class="mt-4 text-center text-medium-emphasis text-caption">
              Supported Wallets: MetaMask, Coinbase, WalletConnect
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: var(--v-theme-surface);
  position: relative;
}

.theme-toggle-container {
  position: fixed;
  top: 28px;
  right: 56px;
  z-index: 1000;
}

.login-container {
  display: grid;
  grid-template-columns: 1.2fr 1.5fr;
  min-height: 100vh;
  width: 100%;
}

// Left Side - Banner
.banner-column {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.banner-box {
  width: 90%;
  height: 90%;
  background-image: url('/FinERP/images/banner3.png');
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  position: relative;
  margin-left: 100px;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
  padding: 2rem;
}

.banner-title {
  color: white;
  font-size: 3.5rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 2rem;
}

.accent-text {
  color: var(--v-primary-base, #39B84C);
}

.banner-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
}

// Right Side - Form
.form-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 50px;
}

.form-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.logo-section {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  font-size: 1.1rem;
  color: var(--v-theme-on-surface-variant);
  margin-bottom: 2.5rem;
  opacity: 0.8;
}

.wallet-button {
  height: 56px !important;
  font-size: 1.1rem !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  font-weight: 600 !important;
}

// Responsive
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .banner-column {
    display: none; // Hide banner on mobile/tablet for simpler login interactions
  }

  .banner-box {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .theme-toggle-container {
    top: 20px;
    right: 20px;
  }
  
  .form-column {
    padding: 20px;
  }

  .form-title {
    font-size: 1.75rem;
  }
}
</style>
