<!-- src/components/AuthGuard.vue -->
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { useEVMWallet } from '@/composables/useEVMWallet';
import { activeAccount } from '@/lib/walletManager';

const router = useRouter();
const { isDark } = useTheme();
const { isConnected } = useEVMWallet();

// Check if wallet is connected (either via EVM wallet or manual wallet)
const walletConnected = computed(() => {
  return isConnected.value || !!activeAccount.value;
});

onMounted(() => {
  // If no wallet is connected, redirect to landing page
  if (!walletConnected.value) {
    console.log('[AuthGuard] No wallet connected, redirecting to landing page');
    router.push('/');
  }
});
</script>

<template>
  <div 
    v-if="walletConnected"
    :class="{ 'dark-theme': isDark }"
  >
    <slot />
  </div>
  <div 
    v-else
    class="auth-guard-loading"
    :class="{ 'dark-theme': isDark }"
  >
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular 
            indeterminate 
            :color="'var(--erp-accent-green)'" 
            size="64" 
          />
          <p class="mt-4 text-h6" :style="{ color: 'var(--erp-text)' }">
            Redirecting to connect wallet...
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.auth-guard-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
