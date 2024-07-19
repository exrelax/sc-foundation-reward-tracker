<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGuidingSessionsStore } from '@/stores/guidingSessions.ts'
import {RouterLink} from "vue-router";

const guidingSessionsStore = useGuidingSessionsStore()
const { getSessionByAccountHandle, getGuideSessionByAccountHandle, getRecruitSessionByAccountHandle } = guidingSessionsStore
const { accounts } = storeToRefs(guidingSessionsStore)

const accountsSorted = computed(() => {
  return accounts.value.sort((a, b) => {
    return a.handle.localeCompare(b.handle)
  }).map(account => {
    const sessions = getSessionByAccountHandle(account.handle)
    const guideSessions = getGuideSessionByAccountHandle(account.handle)
    const recruitSessions = getRecruitSessionByAccountHandle(account.handle)

    return {
      ...account,
      guideSessions,
      recruitSessions,
      sessions,
    }
  })
})
</script>

<template>
  <div>
    <h1>Accounts</h1>
  </div>

  <table class="table mt-3">
    <thead>
      <tr>
        <th>Account</th>
        <th>Guide-Sessions</th>
        <th>Recruit-Sessions</th>
        <th>Sessions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(account, index) in accountsSorted" :key="`${account.id}-${index}`">
        <td><RouterLink :to="`/account/${account.handle}`">{{ account.handle }}</RouterLink></td>
        <td>{{ account.guideSessions.length }}</td>
        <td>{{ account.recruitSessions.length }}</td>
        <td>{{ account.sessions.length }}</td>
      </tr>
    </tbody>
  </table>
</template>