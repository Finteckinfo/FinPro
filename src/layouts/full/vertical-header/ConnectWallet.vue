<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useEVMWallet, type WalletType } from '@/composables/useEVMWallet';
import { activeAccount as walletManagerAccount } from '@/lib/walletManager';
import { isWalletModalOpen as storeWalletModalOpen } from '@/stores/walletStore';
import { useNextAuth } from '@/composables/useNextAuth';
import { useTheme } from '@/composables/useTheme';

// Utils
const baseUrl = import.meta.env.BASE_URL;

// EVM wallet hook
const { 
  user: walletUser, 
  isConnected, 
  disconnect: disconnectWallet, 
  connect,
  isConnecting,
  error: walletError
} = useEVMWallet();

const activeAccount = computed(() => walletUser.value ? { address: walletUser.value.address } : null);

// User Auth
const { user } = useNextAuth();

// Modal visibility
const isWalletModalOpen = storeWalletModalOpen;
const showDisconnectConfirm = ref(false);

// UI State
const toastMsg = ref('');
const showToast = ref(false);
const copied = ref(false);

// Theme
const { isDark } = useTheme();

// Wallets Configuration
const wallets = [
  {
    id: 'metamask' as WalletType,
    name: 'MetaMask',
    icon: `${baseUrl}wallets/metamask.png`,
    description: 'Connect to your MetaMask wallet',
    isPopular: true
  },
  {
    id: 'walletconnect' as WalletType,
    name: 'WalletConnect',
    icon: `${baseUrl}wallets/walletconnect.png`,
    description: 'Scan with Trust, Rainbow, etc.',
    isPopular: false
  },
  {
    id: 'coinbase' as WalletType,
    name: 'Coinbase Wallet',
    // Fallback icon if local asset missing, or use a generic one
    icon: 'https://images.ctfassets.net/q5ulg4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg', 
    description: 'Connect with Coinbase Wallet',
    isPopular: false
  }
];

// --- Watchers & Sync ---------------------------------------

// Make activeAccount available globally
if (typeof window !== 'undefined') {
  (window as any).__useWalletActiveAccount = activeAccount;
  watch(activeAccount, (newVal) => {
    (window as any).__useWalletActiveAccount = newVal;
  });
}

// Sync with global walletManager
watch(activeAccount, (newAccount) => {
  if (newAccount?.address) {
    walletManagerAccount.value = { address: newAccount.address };
    window.dispatchEvent(new CustomEvent('wallet-connected', { detail: { address: newAccount.address } }));
    postWalletToExternalDB(newAccount.address);
  } else {
    walletManagerAccount.value = null;
    window.dispatchEvent(new CustomEvent('wallet-disconnected'));
  }
}, { immediate: true });

// Sync wallet to backend
async function postWalletToExternalDB(walletAddress: string) {
  if (!user.value?.id) return;
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    await fetch(`${backendUrl}/api/user/wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.value.id, walletAddress })
    });
  } catch (err) {
    console.error('Failed to sync wallet to backend', err);
  }
}

// --- Actions -----------------------------------------------

async function handleConnect(walletId: WalletType) {
  try {
    const success = await connect(walletId);
    if (success) {
      showToastMessage('Wallet connected successfully!');
      setTimeout(() => { isWalletModalOpen.value = false; }, 500);
    }
  } catch (err: any) {
    showToastMessage(err.message || 'Failed to connect');
  }
}

async function handleDisconnect() {
  await disconnectWallet();
  showDisconnectConfirm.value = false;
  isWalletModalOpen.value = false;
  showToastMessage('Wallet disconnected');
}

async function handleCopyAddress() {
  if (activeAccount.value?.address) {
    await navigator.clipboard.writeText(activeAccount.value.address);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  }
}

function showToastMessage(msg: string) {
  toastMsg.value = msg;
  showToast.value = true;
}

function shortenAddress(address: string) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Styles
const modalStyle = computed(() => ({
  background: isDark.value ? '#1e293b' : '#ffffff',
  color: isDark.value ? '#f1f5f9' : '#0f172a',
}));

const itemStyle = computed(() => ({
  background: isDark.value ? '#334155' : '#f8fafc',
  borderColor: isDark.value ? '#475569' : '#e2e8f0',
  color: isDark.value ? '#f1f5f9' : '#0f172a'
}));

</script>

<template>
  <!-- Toast -->
  <v-snackbar
    v-model="showToast"
    :timeout="3000"
    :color="isDark ? 'grey-darken-3' : 'grey-lighten-4'"
    class="text-center"
    location="top"
  >
    <span :class="isDark ? 'text-white' : 'text-black'">{{ toastMsg }}</span>
  </v-snackbar>

  <!-- Main Dialog -->
  <v-dialog v-model="isWalletModalOpen" max-width="480" class="wallet-dialog">
    <v-card class="rounded-xl overflow-hidden" elevation="10" :style="modalStyle">
      
      <!-- Header -->
      <div class="px-6 py-5 d-flex justify-space-between align-center border-b">
        <h3 class="text-h6 font-weight-bold">
          {{ activeAccount ? 'Wallet Connected' : 'Connect Wallet' }}
        </h3>
        <v-btn icon variant="text" size="small" @click="isWalletModalOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- Loading State -->
      <div v-if="isConnecting" class="py-12 text-center">
        <v-progress-circular indeterminate color="primary" size="48" width="4"></v-progress-circular>
        <p class="mt-4 font-weight-medium text-body-1">Connecting...</p>
        <p class="text-caption text-medium-emphasis">Please approve the request in your wallet</p>
      </div>

      <!-- Content -->
      <div v-else class="pa-6">
        
        <!-- Error Message -->
        <v-alert
          v-if="walletError"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-4"
          closable
        >
          {{ walletError }}
        </v-alert>

        <!-- Connected View -->
        <div v-if="activeAccount" class="text-center">
          <div class="avatar-container mb-4 mx-auto">
            <v-icon size="40" color="success">mdi-check-decagram</v-icon>
            <div class="pulse-ring"></div>
          </div>
          
          <h4 class="text-h6 font-weight-bold mb-1">{{ shortenAddress(activeAccount.address) }}</h4>
          <p class="text-caption text-medium-emphasis mb-6">Connected to Ethereum Network</p>

          <div class="d-flex gap-3 justify-center">
            <v-btn
              prepend-icon="mdi-content-copy"
              variant="tonal"
              :color="copied ? 'success' : 'primary'"
              @click="handleCopyAddress"
              height="44"
              class="flex-grow-1"
            >
              {{ copied ? 'Copied' : 'Copy' }}
            </v-btn>

            <v-btn
              prepend-icon="mdi-logout"
              variant="outlined"
              color="error"
              @click="showDisconnectConfirm = true"
              height="44"
              class="flex-grow-1"
            >
              Disconnect
            </v-btn>
          </div>
        </div>

        <!-- Provider List -->
        <div v-else class="wallet-grid">
          <p class="text-body-2 text-medium-emphasis mb-4">Select a wallet provider to continue</p>
          
          <button
            v-for="wallet in wallets"
            :key="wallet.id"
            class="wallet-item pa-4 mb-3 d-flex align-center w-100"
            :style="itemStyle"
            @click="handleConnect(wallet.id)"
          >
            <div class="wallet-icon-wrapper mr-4">
              <v-img 
                :src="wallet.icon" 
                width="40" 
                height="40" 
                contain
                class="wallet-icon"
              >
                <template v-slot:placeholder>
                  <v-icon size="32" color="grey">mdi-wallet</v-icon>
                </template>
                <template v-slot:error>
                   <v-icon size="32" color="grey">mdi-wallet-outline</v-icon>
                </template>
              </v-img>
            </div>
            
            <div class="text-left flex-grow-1">
              <div class="d-flex align-center">
                <span class="font-weight-bold text-body-1">{{ wallet.name }}</span>
                <v-chip
                  v-if="wallet.isPopular"
                  size="x-small"
                  color="primary"
                  variant="flat"
                  class="ml-2 font-weight-bold"
                >
                  POPULAR
                </v-chip>
              </div>
              <span class="text-caption text-medium-emphasis">{{ wallet.description }}</span>
            </div>

            <v-icon color="grey-lighten-1">mdi-chevron-right</v-icon>
          </button>
        </div>

        <!-- Footer Info -->
        <div v-if="!activeAccount" class="mt-6 text-center">
          <p class="text-caption text-disabled">
            By connecting a wallet, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </v-card>
  </v-dialog>

  <!-- Disconnect Confirm Dialog -->
  <v-dialog v-model="showDisconnectConfirm" max-width="320">
    <v-card class="rounded-lg pa-4">
      <h3 class="text-h6 font-weight-bold mb-2">Disconnect Wallet?</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">Are you sure you want to disconnect? You will need to reconnect to perform actions.</p>
      
      <div class="d-flex gap-2 justify-end">
        <v-btn variant="text" @click="showDisconnectConfirm = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="handleDisconnect">Disconnect</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.wallet-dialog {
  backdrop-filter: blur(10px);
}

.border-b {
  border-bottom: 1px solid rgba(128, 128, 128, 0.1);
}

.wallet-item {
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.wallet-item:hover {
  transform: translateY(-2px);
  border-color: var(--v-theme-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.wallet-icon-wrapper {
  background: white;
  border-radius: 12px;
  padding: 4px; /* White bg for clear logo visibility */
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-container {
  position: relative;
  width: 64px;
  height: 64px;
  background: rgba(var(--v-theme-success), 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-success));
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.gap-3 { gap: 12px; }
.gap-2 { gap: 8px; }
</style>
