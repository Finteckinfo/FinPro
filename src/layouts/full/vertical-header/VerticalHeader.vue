<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import { useEVMWallet } from '@/composables/useEVMWallet';
import { UserIcon } from 'vue-tabler-icons';

// Icon Imports
import { BellIcon, SettingsIcon, SearchIcon, Menu2Icon } from 'vue-tabler-icons';

// dropdown imports
import NotificationDD from './NotificationDD.vue';
import ProfileDD from './ProfileDD.vue';
import Searchbar from './SearchBarPanel.vue';
import ThemeToggle from '@/components/shared/ThemeToggle.vue';
import NetworkSelector from '@/components/shared/NetworkSelector.vue';

const customizer = useCustomizerStore();
const showSearch = ref(false);

// Wallet Integration
const { user: walletUser, isConnected } = useEVMWallet();

// Generate a deterministic gradient based on address (same as ProfileDD)
const avatarGradient = computed(() => {
  if (!walletUser.value?.address) return 'var(--erp-surface-variant)';
  const addr = walletUser.value.address;
  const hash = addr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%) 0%, hsl(${hue2}, 70%, 50%) 100%)`;
});

function searchbox() {
  showSearch.value = !showSearch.value;
}
</script>

<template>
  <v-app-bar elevation="0" height="80" class="erp-header">
    <!-- Sidebar toggle button for large screens (mini sidebar) -->
    <v-btn
      class="d-none d-lg-block erp-icon-btn erp-hover"
      icon
      rounded="sm"
      variant="flat"
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
      size="small"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>

    <!-- Sidebar toggle button for small screens (sidebar drawer) -->
    <v-btn
      class="d-lg-none erp-icon-btn ms-3 erp-hover"
      icon
      rounded="sm"
      variant="flat"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
      size="small"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>

    <!-- search mobile -->
    <v-btn
      class="d-lg-none erp-icon-btn ml-3 erp-hover"
      icon
      rounded="sm"
      variant="flat"
      size="small"
      @click="searchbox"
    >
      <SearchIcon size="17" stroke-width="1.5" />
    </v-btn>

    <v-sheet v-if="showSearch" class="search-sheet v-col-12 erp-dropdown-surface">
      <Searchbar :closesearch="searchbox" />
    </v-sheet>

    <!-- ---------------------------------------------- -->
    <!-- Search part -->
    <!-- ---------------------------------------------- -->
    <v-sheet class="mx-3 v-col-3 v-col-xl-2 v-col-lg-4 d-none d-lg-block" :style="{ background: 'transparent' }">
      <Searchbar />
    </v-sheet>

    <!---/Search part -->

    <v-spacer />
    <!-- ---------------------------------------------- -->
    <!---right part -->
    <!-- ---------------------------------------------- -->

    <!-- Network Selector -->
    <div class="network-selector-wrapper mr-2">
      <NetworkSelector />
    </div>

    <!-- Theme Toggle - Always visible, label hidden on mobile -->
    <div class="theme-toggle-wrapper">
      <ThemeToggle :show-label="false" size="small" />
    </div>

    <!-- ---------------------------------------------- -->
    <!-- Notification -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn icon class="mx-3 erp-icon-btn erp-hover" rounded="sm" size="small" variant="flat" v-bind="props">
          <BellIcon stroke-width="1.5" size="22" />
        </v-btn>
      </template>
      <v-sheet rounded="md" width="330" elevation="12" class="erp-dropdown-surface">
        <NotificationDD />
      </v-sheet>
    </v-menu>

    <!-- ---------------------------------------------- -->
    <!-- User Profile / Wallet -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn class="profileBtn ml-1" variant="text" rounded="pill" v-bind="props">
          <v-avatar size="35" class="d-flex align-center justify-center elevation-2" :style="{ background: avatarGradient }">
             <UserIcon v-if="!isConnected" size="20" class="text-medium-emphasis" />
             <UserIcon v-else size="20" color="white" />
          </v-avatar>
        </v-btn>
      </template>
      <v-sheet rounded="xl" width="360" elevation="12" class="erp-dropdown-surface mt-2 overflow-hidden">
        <ProfileDD />
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.theme-toggle-wrapper {
  display: flex;
  align-items: center;
  margin: 0 0.5rem;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .theme-toggle-wrapper {
    margin: 0 0.25rem;
  }
  
  /* Make the theme toggle button smaller on mobile */
  .theme-toggle-wrapper :deep(.theme-toggle-btn) {
    padding: 0.25rem;
  }
  
  .theme-toggle-wrapper :deep(.toggle-icon-container) {
    width: 36px;
    height: 36px;
  }
  
  /* Hide the label text on mobile */
  .theme-toggle-wrapper :deep(.theme-label) {
    display: none;
  }
}

@media (max-width: 480px) {
  .theme-toggle-wrapper {
    margin: 0;
  }
  
  .theme-toggle-wrapper :deep(.toggle-icon-container) {
    width: 32px;
    height: 32px;
  }
}
</style>
