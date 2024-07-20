<script lang="ts" setup>
import { computed, ref } from 'vue'
import foundationData from '@/assets/foundationData.js'
import SvgIcon from '@/components/helpers/SvgIcon.vue'

const { guidingCategories } = foundationData

interface GuidingCategoryCardInterface {
  id: string
  element?: string
  modelValue?: string[] | null
}

const props = withDefaults(defineProps<GuidingCategoryCardInterface>(), {
  element: 'div',
})

const localModelValue = defineModel()

const rootCssClassNames = ref({
  'guiding-category-card': true,
  'guiding-category-card--selection': props.modelValue != null,
})

const containerCssClassNames = computed(() => {
  return {
    'guiding-category-card__container': true,
    'guiding-category-card__container--label': props.modelValue != null,
    'guiding-category-card__container--active': props.modelValue != null && props.modelValue.includes(props.id),
  }
})

const category = ref(guidingCategories.find((category) => category.id === props.id))
</script>

<template>
  <component :is="element" :class="rootCssClassNames">
    <component :is="modelValue != null ? 'label' : 'div'" :for="props.id" :class="containerCssClassNames">
      <header class="guiding-category-card__header">
        <SvgIcon :name="`rsi/guiding-${props.id}`" />
      </header>
      <input
          v-if="modelValue"
          type="checkbox"
          class="btn-check"
          :value="category.id"
          :id="category.id"
          v-model="localModelValue"
          autocomplete="off"
      />
      <div class="guiding-category-card__title">
        {{ category.name }}
      </div>
    </component>
  </component>
</template>

<style lang="scss">
.guiding-category-card__container {
  --border-radius: 10px;

  width: 120px;
  border-radius: var(--border-radius);
  background-color: var(--color-gray-200);
}

.guiding-category-card__container--label {
  cursor: pointer;
  background-color: var(--color-gray-500);
  transition-duration: var(--transition-duration);
  transition-timing-function: var(transition-timing-function);
  transition-property: background-color;

  .icon {
    width: 50px;
    height: 50px;
    opacity: .6;
    transition-duration: var(--transition-duration);
    transition-timing-function: var(transition-timing-function);
    transition-property: opacity;
  }
}

.guiding-category-card__header {
  --horizontal-padding-px: var(--padding-sm-px);
  --vertical-padding-px: var(--padding-sm-px);

  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: var(--vertical-padding-px) var(--horizontal-padding-px);
}

.guiding-category-card__title {
  --horizontal-padding-px: var(--padding-md-px);
  --vertical-padding-px: var(--padding-5-px);
  --line-height-scale: var(--line-height-20-scale);
  --line-height-px: var(--line-height-20-px);

  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  height: calc((2 * var(--line-height-px)) + (2 * var(--vertical-padding-px)));
  margin: 0;
  padding: var(--vertical-padding-px) var(--horizontal-padding-px);
  line-height: var(--line-height-scale);
  text-align: center;
  background-color: rgb(var(--color-black-rgb) / 10%);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  color: var(--color-rsi-dark-theme-secondary-900);
}

.guiding-category-card__container--active {
  background-color: var(--color-gray-200);

  &.guiding-category-card__container--label {
    .icon {
      opacity: .8;
    }
  }

  .guiding-category-card__title {
    color: var(--color-rsi-dark-theme-secondary-800);
  }
}
</style>