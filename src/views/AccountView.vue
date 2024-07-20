<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGuidingSessionsStore } from '@/stores/guidingSessions'
import SessionTable from '@/components/modules/SessionTable.vue'

const route = useRoute()
const guidingSessionsStore = useGuidingSessionsStore()
const { getAccountByHandle, getSessionByAccountHandle, getGuideSessionByAccountHandle, getRecruitSessionByAccountHandle } = guidingSessionsStore

const account = computed(() => {
  const foundAccount = getAccountByHandle(route.params.handle as string)
  const sessions = getSessionByAccountHandle(route.params.handle as string)
  const guideSessions = getGuideSessionByAccountHandle(route.params.handle as string)
  const recruitSessions = getRecruitSessionByAccountHandle(route.params.handle as string)

  return {
    ...foundAccount,
    sessions,
    guideSessions,
    recruitSessions,
  }
})
</script>

<template>
  <section>
    <header>
      <h1>{{ account.handle }}</h1>
    </header>

    <div class="row">
      <div class="col-6">
        <h2>Guide Sessions</h2>

        <SessionTable :sessions="account.guideSessions" :show-guide="false" />
      </div>
      <div class="col-6">
        <h2>Recruit Sessions</h2>

        <SessionTable :sessions="account.recruitSessions" :show-recruit="false" />
      </div>
    </div>
  </section>
</template>