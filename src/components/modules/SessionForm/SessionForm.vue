<script lang="ts" setup>
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import {type GuidingSessionRole, type GuidingSessionPayload, type GuidingSession} from '@/models/guidingSession.model'
import { useGuidingSessionsStore } from '@/stores/guidingSessions'
import { useToastsStore } from '@/stores/toasts'
import GuidingCategorySelector from './GuidingCategorySelector.vue'

interface SessionFormProps {
  session?: GuidingSession
}

const props = defineProps<SessionFormProps>()
const emit = defineEmits(['closeModal'])

const guidingSessionsStore = useGuidingSessionsStore()
const { addSession, updateSession, removeSessionById } = guidingSessionsStore
const toastsStore = useToastsStore()

const updateLocalRefs = () => {
  guideAccountHandle.value = props.session?.roles?.find(role => role.accountRole_id === 'guide')?.account ?? ''
  recruitAccountHandle.value = props.session?.roles?.find(role => role.accountRole_id === 'recruit')?.account ?? ''
  startDateTime.value = props.session?.fromDate ? dayjs(props.session.fromDate).format(dateFormatString) : defaultStartDateTime
  endDateTime.value = props.session?.toDate ? dayjs(props.session.toDate).format(dateFormatString) : ''
  selectedGuideCategories.value = props.session?.guidingCategory_ids ?? [] as string[]
  sessionToUpdate.value = !!props.session
}

const sessionToUpdate = ref(false)
const dateFormatString = 'YYYY-MM-DDTHH:mm'
const defaultStartDateTime = dayjs().format(dateFormatString)

const rolesTemplate = [
  { account: '', accountRole_id: 'guide' },
  { account: '', accountRole_id: 'recruit' },
] as GuidingSessionRole[]

const guideAccountHandle = ref('')
const recruitAccountHandle = ref('')
const startDateTime = ref(defaultStartDateTime)
const endDateTime = ref( '')
const selectedGuideCategories = ref( [] as string[])

updateLocalRefs()

watch(props.session as any, () => {
  updateLocalRefs()
}, { deep: true })

const createPayload = () : GuidingSessionPayload => {
  const roles = [
    { account: guideAccountHandle.value, accountRole_id: 'guide' },
    { account: recruitAccountHandle.value, accountRole_id: 'recruit' },
  ] as GuidingSessionRole[]

  const startDateTimeDjs = dayjs(startDateTime.value)
  const endDateTimeDjs = dayjs(endDateTime.value)

  const payload = {
    fromDate: startDateTimeDjs.toDate(),
    toDate: endDateTimeDjs?.toDate() ?? null,
    roles,
    guidingCategory_ids: selectedGuideCategories.value,
  } as GuidingSessionPayload

  if (props.session?.id != null) {
    payload.id = props.session.id
  }

  return payload
}

const submit = () => {
  let toastTitle, toastType, toastMessage

  const payload = createPayload()
  const result = sessionToUpdate.value ? updateSession(payload) : addSession(payload)

  if (sessionToUpdate.value) {
    toastTitle = result ? 'Session updated' : 'Failed to update session'
    toastType = result ? 'success' : 'error'
    toastMessage = result ? 'Session updated successfully' : 'Failed to update session'
  } else {
    toastTitle = result ? 'Session added' : 'Failed to add session'
    toastType = result ? 'success' : 'error'
    toastMessage = result ? 'Session added successfully' : 'Failed to add session'
  }

  toastsStore.addToast({
    title: toastTitle,
    message: toastMessage,
    type: toastType,
  })

  if (result) {
    clearForm()
    emit('closeModal')
  }
}

const remove = () => {
  if (props.session?.id == null) {
    return
  }

  const result = removeSessionById(props.session?.id)

  if (result) {
    clearForm()
    emit('closeModal')
  }
}

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

        <button v-if="!sessionToUpdate" class="btn btn-primary" @click="submit">Add</button>
        <button v-if="sessionToUpdate" class="btn btn-primary" @click="submit">Save</button>
        <button v-if="sessionToUpdate" class="btn btn-primary" @click="remove">Delete</button>
      </fieldset>
    </form>
  </div>
</template>

<style lang="scss">
.session-form-container {
  padding: 20px;
}
</style>
