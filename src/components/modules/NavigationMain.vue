<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const navigationItems = ref([
  { name: 'Home', path: '/' },
  { name: 'Accounts', path: '/accounts' },
  { name: 'About', path: '/about' },
])
</script>

<template>
  <nav class="nav-main">
    <ul class="nav-main__list">
      <li v-for="(item, index) in navigationItems" :key="index" class="nav-main__list-item">
        <RouterLink :to="item.path" class="nav-main__link">{{ item.name }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
.nav-main__list,
.nav-main__list-item {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-main__list {
  display: flex;
  gap: 1rem;
  justify-content: start;
}

.nav-main__link {
  display: block;
  padding: var(--padding-5-px) var(--padding-sm-px);
  text-decoration: none;
  background-color: var(--color-rsi-dark-theme-secondary-300);
}
</style>