<script lang="ts" setup>
import NavigationMain from '@/components/modules/NavigationMain.vue'
import NavigationSecondary from '@/components/modules/NavigationSecondary.vue'
</script>

<template>
  <header class="page-header">
    <div class="container">
      <NavigationMain />
      <NavigationSecondary />
    </div>
  </header>
</template>

<style lang="scss">
.page-header {
  padding: var(--padding-md-px) 0;
}
</style>