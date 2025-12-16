import { ref, computed, onMounted, onUnmounted } from 'vue';

const isMobile = ref(false);
const isTablet = ref(false);
const isDesktop = ref(true);

export function useMobile() {
  const updateDeviceType = () => {
    const width = window.innerWidth;
    isMobile.value = width <= 768;
    isTablet.value = width > 768 && width <= 1024;
    isDesktop.value = width > 1024;
  };

  onMounted(() => {
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateDeviceType);
  });

  return {
    isMobile: computed(() => isMobile.value),
    isTablet: computed(() => isTablet.value),
    isDesktop: computed(() => isDesktop.value),
    isTouchDevice: computed(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)
  };
}
