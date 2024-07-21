<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGuidingSessionsStore } from '@/stores/guidingSessions'
import SessionForm from '@/components/modules/SessionForm/SessionForm.vue'
import SessionTable from '@/components/modules/SessionTable.vue'
import Modal from '@/components/modules/Modal.vue'

const guidingSessionsStore = useGuidingSessionsStore()
const { sessions } = storeToRefs(guidingSessionsStore)

const filteredSessions = computed(() => {
  return sessions.value.filter(session => {
    return session.completed
  })
})

const showEntryModal = ref(false)

const openEntryModal = () => {
  showEntryModal.value = true
}
</script>

<template>
  <div>
    <h1>Dashboard</h1>

    <button class="btn btn-primary" @click="openEntryModal()">
      Add entry
    </button>

    <section class="mt-3">
      <header>
        <h2>Completed Sessions</h2>
      </header>
      <SessionTable :sessions="filteredSessions"/>
    </section>

    <Modal v-model="showEntryModal">
      <SessionForm />
    </Modal>
  </div>
</template>