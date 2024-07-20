<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
}

const props = defineProps<Props>()

const fileName = computed(() => props.name.split('/')[0])
const iconName = computed(() => props.name.split('/')[1])
</script>

<template>
  <svg :class="['icon', `icon--${iconName}`]">
    <use
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :xlink:href="`/images/svg-sprites/${fileName}.svg#icon-${iconName}`"
    ></use>
  </svg>
</template>
