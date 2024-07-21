<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGuidingSessionsStore } from '@/stores/guidingSessions'
import SessionTable from '@/components/modules/SessionTable.vue'

const route = useRoute()
const guidingSessionsStore = useGuidingSessionsStore()
const {
  getAccountByHandle,
  getSessionsByAccountHandle,
  getGuideSessionsByAccountHandle,
  getRecruitSessionsByAccountHandle,
  getRewardsForAccount,
} = guidingSessionsStore

const accountHandle = computed(() => route.params.handle)

const account = computed(() => {
  const foundAccount = getAccountByHandle(accountHandle.value)
  const sessions = getSessionsByAccountHandle(accountHandle.value)
  const guideSessions = getGuideSessionsByAccountHandle(accountHandle.value)
  const recruitSessions = getRecruitSessionsByAccountHandle(accountHandle.value)

  return {
    ...foundAccount,
    sessions,
    guideSessions,
    recruitSessions,
  }
})

const completedRewards = computed(() => {
  const rewards = getRewardsForAccount(account.value.handle)

  return rewards.filter(reward => reward.completed)
})

const incompleteRewards = computed(() => {
  const rewards = getRewardsForAccount(account.value.handle)

  return rewards.filter(reward => !reward.completed)
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

    <h2>Rewards</h2>

    <div class="row">
      <div class="col-6">
        <h2>Completed</h2>

        <ul>
          <li v-for="(reward, index) in completedRewards" :key="`completed-${reward.id}-${index}`">
            {{ reward.name }}
          </li>
        </ul>
      </div>
      <div class="col-6">
        <h2>Not completed</h2>

        <ul>
          <li v-for="(reward, index) in incompleteRewards" :key="`incomplete-${reward.id}-${index}`">
            {{ reward.name }}
          </li>
        </ul>
      </div>
    </div>


  </section>
</template>