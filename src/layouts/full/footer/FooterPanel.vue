<script setup lang="ts">
// Simplified footer - just showing Beta Version
</script>
<template>
  <v-footer
    class="px-0 footer"
    :style="{
      background: 'var(--erp-header-bg)',
      color: 'var(--erp-text)',
      borderTop: '1px solid var(--erp-border)',
      width: '100%',
      margin: '0',
      paddingLeft: '0',
      paddingRight: '0',
      borderRadius: '0'
    }"
  >
    <v-row justify="center" align="center" no-gutters style="width: 100%">
      <v-col cols="12" class="text-center">
        <p class="text-body-1 mb-0">
          Beta Version
        </p>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style lang="scss">
.v-footer {
  position: unset;
}
</style>
