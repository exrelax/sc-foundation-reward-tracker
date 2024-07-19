<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useGuidingSessionsStore } from '@/stores/guidingSessions.ts'
import { useToastsStore } from '@/stores/toasts.ts'
import GuidingCategorySelector from './GuidingCategorySelector.vue'

const guidingSessionsStore = useGuidingSessionsStore()
const toastsStore = useToastsStore()

const defaultStartDateTime = dayjs().format('YYYY-MM-DDTHH:mm')

const guideAccountHandle = ref('')
const recruitAccountHandle = ref('')
const startDateTime = ref(defaultStartDateTime)
const endDateTime = ref('')

const selectedGuideCategories = ref([])

const submit = () => {
  const roles = [
    { account: guideAccountHandle.value, accountRole_id: 'guide' },
    { account: recruitAccountHandle.value, accountRole_id: 'recruit' },
  ]

  const startDateTimeDjs = dayjs(startDateTime.value)
  const endDateTimeDjs = dayjs(endDateTime.value)
  const payload = {
    fromDate: startDateTimeDjs.toDate(),
    toDate: endDateTimeDjs.toDate(),
    roles,
    guidingCategory_ids: selectedGuideCategories.value,
    completed: false,
  }

  const result = guidingSessionsStore.addSession(payload)

  const toastTitle = result ? 'Session added' : 'Failed to add session'
  const toastType = result ? 'success' : 'error'
  const toastMessage = result ? 'Session added successfully' : 'Failed to add session'

  toastsStore.addToast({
    title: toastTitle,
    message: toastMessage,
    type: toastType,
  })

  if (result) {
    clearForm()
  }
};

const clearForm = () => {
  guideAccountHandle.value = ''
  recruitAccountHandle.value = ''
  startDateTime.value = defaultStartDateTime
  endDateTime.value = ''
  selectedGuideCategories.value = []
}
</script>

<template>
  <div class="session-form-container mt-3">
    <form @submit.prevent>
      <fieldset>
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label for="guide" class="form-label">Guide</label>
              <input id="guide" type="text" class="form-control" v-model="guideAccountHandle" required />
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label for="recruit" class="form-label">Recruit</label>
              <input id="recruit" type="text" class="form-control" v-model="recruitAccountHandle" required/>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-6">
            <div>
              <label for="datetime-start" class="form-label">Start</label>
              <input
                  id="datetime-start"
                  type="datetime-local"
                  class="form-control"
                  v-model="startDateTime"
                  required
              />
            </div>
          </div>
          <div class="col-6">
            <div>
              <label for="datetime-end" class="form-label">End</label>
              <input
                  id="datetime-end"
                  type="datetime-local"
                  class="form-control"
                  v-model="endDateTime"
              />
            </div>
          </div>
        </div>

        <GuidingCategorySelector class="mt-3" v-model="selectedGuideCategories" />

        <button class="btn btn-primary" @click="submit">Add</button>
      </fieldset>
    </form>
  </div>
</template>

<style lang="scss">
.session-form-container {
  padding: 20px;
  border: 1px solid #efefef;
  border-radius: 5px;
  box-shadow:
      0 0 0 1px rgba(255 255 200 / 90%),
      2px 2px 6px rgb(0 0 0 / 60%);
}
</style>
