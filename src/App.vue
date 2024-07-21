<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import PageHeader from '@/components/layouts/PageHeader.vue'
import Toasts from '@/components/modules/Toasts.vue'
</script>

<template>
  <PageHeader />

  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>

  <Toasts />
</template>

<style>

</style>
