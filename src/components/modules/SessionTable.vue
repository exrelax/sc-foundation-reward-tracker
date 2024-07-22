<script lang="ts" setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import SvgIcon from '@/components/helpers/SvgIcon.vue'
import { type GuidingSessionRole, type GuidingSession } from '@/models/guidingSession.model'
import Modal from '@/components/modules/Modal.vue'
import SessionForm from '@/components/modules/SessionForm/SessionForm.vue'

interface SessionTableProps {
  sessions: GuidingSession[]
  showGuide?: boolean
  showRecruit?: boolean
  linkGuideAccount?: boolean
  linkRecruitAccount?: boolean
}

const props = withDefaults(defineProps<SessionTableProps>(), {
  showGuide: true,
  showRecruit: true,
  linkGuideAccount: true,
  linkRecruitAccount: true,
})

const dateFormatString = 'YYYY-MM-DD HH:mm'

const sessions = computed(() => {
  return props.sessions.map((session) => {
    return {
      ...session,
      fromDate: dayjs(session.fromDate).format(dateFormatString),
      toDate: dayjs(session.toDate).format(dateFormatString),
      duration: dayjs(session.toDate).diff(dayjs(session.fromDate), 'minute'),
      session,
    }
  })
})

const sessionToEdit = ref(null as GuidingSession | null)
const showEditModal = ref(false)

const editEntry = (session: GuidingSession) => {
  sessionToEdit.value = session
  showEditModal.value = true
}
</script>

<template>
  <table class="session-table table mt-3">
    <thead>
      <tr>
        <th>Start</th>
        <th>End</th>
        <th>Duration</th>
        <th v-if="props.showGuide">Guide</th>
        <th v-if="props.showRecruit">Recruit</th>
        <th>Guiding Categories</th>
        <th>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(session, index) in sessions" :key="`${session.id}-${index}`">
        <td>{{ session.fromDate }}</td>
        <td>{{ session.toDate }}</td>
        <td>{{ session.duration }}</td>
        <td v-if="props.showGuide">
          <router-link v-if="props.linkGuideAccount" :to="`/account/${session.roles?.find((role: GuidingSessionRole) => role.accountRole_id === 'guide')?.account}`">{{ session.roles?.find(role => role.accountRole_id === 'guide')?.account }}</router-link>
          <span v-else>{{ session.roles?.find((role: GuidingSessionRole) => role.accountRole_id === 'guide')?.account }}</span>
        </td>
        <td v-if="props.showRecruit">
          <router-link v-if="props.linkRecruitAccount" :to="`/account/${session.roles?.find((role: GuidingSessionRole) => role.accountRole_id === 'recruit')?.account}`">{{ session.roles?.find(role => role.accountRole_id === 'recruit')?.account }}</router-link>
          <span v-else>{{ session.roles?.find((role: GuidingSessionRole) => role.accountRole_id === 'recruit')?.account }}</span>
        </td>
        <td>{{ session.guidingCategory_ids?.join(', ') }}</td>
        <td>
          <button class="btn btn-outline-secondary" @click="editEntry(session.session)">
            <SvgIcon name="material/edit" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <Modal v-model="showEditModal">
    <SessionForm v-if="showEditModal && sessionToEdit" :session="sessionToEdit" @close-modal="() => showEditModal = false" />
  </Modal>
</template>

<style lang="scss">
</style>