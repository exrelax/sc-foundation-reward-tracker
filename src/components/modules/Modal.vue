<script lang="ts" setup>
import { watch } from 'vue'
import SvgIcon from '@/components/helpers/SvgIcon.vue'

export interface ModalProps {
  modelValue?: boolean
}

withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
})

const show = defineModel()

const close = () => {
  show.value = false
}

watch(show, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal__background">
      <div class="modal__container">
        <button class="btn btn-outline-secondary btn--close" @click="close">
          <SvgIcon name="material/close" class="modal__close" />
        </button>
        <div class="modal__content">
          <slot>

          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
.modal-enter-active,
.modal-leave-active {
  transition-duration: var(--transition-duration);
  transition-timing-function: var(--transition-timing-function);
  transition-property: opacity;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal,
.modal__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
}

.modal__background {
  background-color: rgb(var(--color-black-rgb) / 20%);
  backdrop-filter: blur(2px);
}

.modal__container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: var(--spacing-grid-md-px);
  background-color: var(--color-white);
  border-radius: 10px;
}

.modal__container .btn--close {
  position: absolute;
  top: var(--spacing-grid-sm-px);
  right: var(--spacing-grid-sm-px);
}
</style>