<template>
  <v-app :class="{ 'dark-theme': isDark }">
    <StarryBackground v-if="isDark" />
    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { useSSOWallet } from '@/composables/useSSOWallet';
import StarryBackground from '@/components/ui/StarryBackground.vue';

const { isDark } = useTheme();

// Auto-connect wallet from SSO session
useSSOWallet();
</script>

<style>
.v-application {
  background-color: var(--theme-page-bg) !important;
  color: var(--theme-text-color) !important;
  position: relative;
}

.v-main {
  background-color: transparent !important;
  position: relative;
  z-index: 1;
}
</style>
