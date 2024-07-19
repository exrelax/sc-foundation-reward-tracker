<script setup>
import foundationData from '@/assets/foundationData.js'

const { guidingCategories } = foundationData

const localModelValue = defineModel()
</script>

<template>
  <div class="session-from-guiding-categories">
    <ul class="session-from-guiding-categories__list">
      <li
          v-for="(category, index) in guidingCategories"
          :key="index"
          class="session-from-guiding-categories__list-item"
      >
        <input
            type="checkbox"
            class="btn-check"
            :value="category.id"
            :id="category.id"
            v-model="localModelValue"
            autocomplete="off"
        />
        <label class="btn btn-primary" :for="category.id">
          {{ category.name }}
          <span class="badge text-bg-secondary" title="completed">4</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.session-from-guiding-categories__list,
.session-from-guiding-categories__list-item {
  list-style: none;
  margin: 0;
  padding: 0;
}

.session-from-guiding-categories__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.session-from-guiding-categories__list-item {
  margin: 0 0 0.5em 0.5em;

  &:first-child {
    margin-left: 0;
  }
}
</style>
