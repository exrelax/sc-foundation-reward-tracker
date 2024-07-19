<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toasts from '@/components/Toasts.vue'
</script>

<template>
  <header>
    <div class="container">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>

  <Toasts />
</template>

<style>

</style>
