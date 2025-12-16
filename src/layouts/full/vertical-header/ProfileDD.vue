<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEVMWallet } from '@/composables/useEVMWallet';
import { isWalletModalOpen } from '@/stores/walletStore';
import { useTheme } from '@/composables/useTheme';

// Icons
import { 
  UserIcon, 
  CopyIcon, 
  LogoutIcon, 
  SettingsIcon,
  ChevronRightIcon
} from 'vue-tabler-icons';

// Theme
const { isDark } = useTheme();

// Wallet Hook
const { user: walletUser, isConnected, disconnect } = useEVMWallet();

// Utils
const copied = ref(false);

const shortenedAddress = computed(() => {
  if (!walletUser.value?.address) return '';
  const addr = walletUser.value.address;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
});

const walletBalance = computed(() => {
  if (!walletUser.value?.balance) return '0.00';
  return parseFloat(walletUser.value.balance).toFixed(4);
});

async function handleCopy() {
  if (walletUser.value?.address) {
    await navigator.clipboard.writeText(walletUser.value.address);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  }
}

function openWalletConnect() {
  isWalletModalOpen.value = true;
}

async function handleDisconnect() {
  await disconnect();
}

// Generate a deterministic gradient based on address
const avatarGradient = computed(() => {
  if (!walletUser.value?.address) return 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';
  const addr = walletUser.value.address;
  // Simple hash for hue
  const hash = addr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%) 0%, hsl(${hue2}, 70%, 50%) 100%)`;
});

</script>

<template>
  <div class="pa-4 profile-dd">
    <!-- CONNECTED STATE -->
    <div v-if="isConnected && walletUser">
      <div class="d-flex align-center mb-4">
        <div class="wallet-avatar mr-3" :style="{ background: avatarGradient }">
          <UserIcon size="24" color="white" />
        </div>
        <div>
          <h4 class="text-h6 font-weight-bold mb-0">My Wallet</h4>
          <span class="text-caption text-medium-emphasis">{{ shortenedAddress }}</span>
        </div>
      </div>

      <div class="balance-card pa-4 mb-4 rounded-lg">
        <span class="text-caption text-medium-emphasis d-block mb-1">Total Balance</span>
        <div class="d-flex align-end">
          <h3 class="text-h4 font-weight-bold mr-2">{{ walletBalance }}</h3>
          <span class="text-subtitle-1 mb-1 font-weight-medium">ETH</span>
        </div>
      </div>

      <v-divider class="mb-3"></v-divider>

      <v-list class="pa-0" density="compact">
        <!-- Copy Address -->
        <v-list-item 
          rounded="md" 
          class="mb-1 ActionItem" 
          @click="handleCopy"
          ripple
        >
          <template v-slot:prepend>
            <CopyIcon size="20" class="mr-2 text-medium-emphasis" />
          </template>
          <v-list-item-title class="text-body-2">
            {{ copied ? 'Copied!' : 'Copy Address' }}
          </v-list-item-title>
        </v-list-item>

        <!-- Account Settings (Placeholder for future) -->
        <v-list-item 
          rounded="md" 
          class="mb-1 ActionItem"
          ripple
        >
          <template v-slot:prepend>
            <SettingsIcon size="20" class="mr-2 text-medium-emphasis" />
          </template>
          <v-list-item-title class="text-body-2">Settings</v-list-item-title>
          <template v-slot:append>
             <ChevronRightIcon size="16" class="text-medium-emphasis" />
          </template>
        </v-list-item>

        <!-- Disconnect -->
        <v-list-item 
          rounded="md" 
          class="ActionItem mt-2 text-error" 
          @click="handleDisconnect"
          ripple
        >
          <template v-slot:prepend>
            <LogoutIcon size="20" class="mr-2 text-error" />
          </template>
          <v-list-item-title class="text-body-2 font-weight-medium">Disconnect</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

    <!-- NOT CONNECTED STATE -->
    <div v-else class="text-center py-6">
      <div class="wallet-avatar mb-4 mx-auto" style="background: var(--er-surface-variant)">
        <UserIcon size="32" class="text-medium-emphasis" />
      </div>
      
      <h3 class="text-h6 font-weight-bold mb-2">Connect Wallet</h3>
      <p class="text-body-2 text-medium-emphasis mb-6 px-4">
        Connect your wallet to access your profile, assets, and more.
      </p>

      <v-btn 
        block 
        color="primary" 
        size="large" 
        class="rounded-lg font-weight-bold"
        elevation="0"
        @click="openWalletConnect"
      >
        Connect Wallet
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.wallet-avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.balance-card {
  background: rgba(var(--v-theme-primary), 0.05);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.ActionItem {
  transition: all 0.2s;
  cursor: pointer;
}

.ActionItem:hover {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  color: rgb(var(--v-theme-primary));
}

.ActionItem:hover :deep(.text-medium-emphasis) {
    color: rgb(var(--v-theme-primary)) !important;
}

.text-error {
  color: rgb(var(--v-theme-error)) !important;
}
</style>
