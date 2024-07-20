<script lang="ts" setup>
import { ref,  computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToastsStore } from '@/stores/toasts'

let interval: any = null
const toastsStore = useToastsStore()
const { activeToasts } = storeToRefs(toastsStore)
const { getToastsWithAgeValues } = toastsStore

const toastAgeValues = ref(getToastsWithAgeValues())

watch(activeToasts, () => {
  toastAgeValues.value = getToastsWithAgeValues()
})

const localToasts = computed(() => {
  return activeToasts.value
})

const close = (id: string) => {
  toastsStore.removeToast(id)
}

onMounted(() => {
  interval = setInterval(() => {
    try {
      toastAgeValues.value = getToastsWithAgeValues()
    } catch (error) {
      console.error(error)
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div
     class="toast-container position-fixed top-0 end-0 p-3"
  >
    <div
        v-for="(toast, index) in toastAgeValues"
        :key="`${toast.id}-${index}`"
        :id="`liveToast-${toast.id}`"
        class="toast show" role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
      <div class="toast-header">
        <strong class="me-auto">{{ toast.title }}</strong>
        <small>{{ toast.ageString }}</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" @click="close(toast.id)"></button>
      </div>
      <div class="toast-body">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>