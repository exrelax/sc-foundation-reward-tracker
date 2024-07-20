<script setup>
import foundationData from '@/assets/foundationData.js'
import SvgIcon from '@/components/helpers/SvgIcon.vue'
import GuidingCategoryCard from '@/components/elements/GuidingCategoryCard.vue'

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
        <GuidingCategoryCard :id="category.id" v-model="localModelValue" />
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
