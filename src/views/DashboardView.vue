<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGuidingSessionsStore } from '@/stores/guidingSessions.ts'
import SessionForm from '@/components/SessionForm/SessionForm.vue'
import SessionTable from '@/components/SessionTable.vue'
import SvgIcon from '@/components/helpers/SvgIcon.vue'

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