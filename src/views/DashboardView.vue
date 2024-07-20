<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGuidingSessionsStore } from '@/stores/guidingSessions'
import SessionForm from '@/components/modules/SessionForm/SessionForm.vue'
import SessionTable from '@/components/modules/SessionTable.vue'

const guidingSessionsStore = useGuidingSessionsStore()
const { sessions } = storeToRefs(guidingSessionsStore)

const filteredSessions = computed(() => {
  return sessions.value.filter(session => {
    return session.completed
  })
})
</script>

<template>
  <div>
    <h1>Dashboard</h1>

    <SessionForm />

    <section class="mt-3">
      <header>
        <h2>Completed Sessions</h2>
      </header>
      <SessionTable :sessions="filteredSessions"/>
    </section>
  </div>
</template>