<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGuidingSessionsStore } from '@/stores/guidingSessions'
import {RouterLink} from "vue-router";
import AccountsTable from '@/components/modules/AccountsTable.vue'

const guidingSessionsStore = useGuidingSessionsStore()
const {
  getFavoriteAccounts,
  getNonFavoriteAccounts,
  getSessionsByAccountHandle,
  getGuideSessionsByAccountHandle,
  getRecruitSessionsByAccountHandle
} = guidingSessionsStore
const { accounts } = storeToRefs(guidingSessionsStore)

const favoriteAccounts = computed(() => {
  return getFavoriteAccounts()
})

const nonFavoriteAccounts = computed(() => {
  return getNonFavoriteAccounts()
})
</script>

<template>
  <div>
    <h1>Accounts</h1>
  </div>

  <article v-if="favoriteAccounts.length > 0">
    <header>
      <h2>Favorite Accounts</h2>
    </header>

    <AccountsTable selection="favorite"/>
  </article>

  <article v-if="nonFavoriteAccounts.length > 0">
    <header>
      <h2>Accounts</h2>
    </header>

    <AccountsTable selection="non-favorite"/>
  </article>
</template>