<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGuidingSessionsStore, type Account } from '@/stores/guidingSessions'
import { type GuidingSession } from '@/models/guidingSession.model'
import SvgIcon from '@/components/helpers/SvgIcon.vue'

export interface AccountsTableProps {
  selection?: 'all' | 'favorite' | 'non-favorite'
}

export interface AccountWithSessions extends Account {
  sessions: GuidingSession[]
  guideSessions: GuidingSession[]
  recruitSessions: GuidingSession[]
}

const props = withDefaults(defineProps<AccountsTableProps>(), {
  selection: 'all',
})

const guidingSessionsStore = useGuidingSessionsStore()
const {
  getSessionsByAccountHandle,
  getGuideSessionsByAccountHandle,
  getRecruitSessionsByAccountHandle,
  setAccountToFavorite,
  setAccountToNonFavorite,
} = guidingSessionsStore
const { accounts } = storeToRefs(guidingSessionsStore)

const accountsSorted = computed(() => {
  return accounts.value.sort((a, b) => {
    return a.handle.localeCompare(b.handle)
  }).map(account => {
    return {
      ...account,
      sessions: getSessionsByAccountHandle(account.handle),
      guideSessions: getGuideSessionsByAccountHandle(account.handle),
      recruitSessions: getRecruitSessionsByAccountHandle(account.handle),
    } as AccountWithSessions
  }).filter(account => {
    if (props.selection === 'all') return true
    if (props.selection === 'favorite') return account.favorite
    if (props.selection === 'non-favorite') return !account.favorite
    return false
  })
})

const toggleFavorite = (account: AccountWithSessions) => {
  if (account.favorite) {
    setAccountToNonFavorite(account.handle)
  } else {
    setAccountToFavorite(account.handle)
  }
}
</script>

<template>
  <table class="table mt-3 accounts-table">
    <thead>
      <tr>
        <th class="accounts-table__th accounts-table__th--account">Account</th>
        <th class="accounts-table__th accounts-table__th--guide-sessions">Guide-Sessions</th>
        <th class="accounts-table__th accounts-table__th--recruit-sessions">Recruit-Sessions</th>
        <th class="accounts-table__th accounts-table__th--sessions">Sessions</th>
        <th class="accounts-table__th accounts-table__th--favorite">Favorite</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(account, index) in accountsSorted" :key="`${account.id}-${index}`">
        <td class="accounts-table__td accounts-table__td--account">
          <RouterLink :to="`/account/${account.handle}`">{{ account.handle }}</RouterLink>
        </td>
        <td class="accounts-table__td accounts-table__td--guide-sessions">{{ account.guideSessions.length }}</td>
        <td class="accounts-table__td accounts-table__td--recruit-sessions">{{ account.recruitSessions.length }}</td>
        <td class="accounts-table__td accounts-table__td--sessions">{{ account.sessions.length }}</td>
        <td class="accounts-table__td accounts-table__td--favorite">
          <button class="btn btn-outline-secondary" @click="toggleFavorite(account)">
            <SvgIcon :name="account.favorite ? 'material/favorite-fill' : 'material/favorite'"/>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
.accounts-table {

}

.accounts-table__th--recruit-sessions,
.accounts-table__td--recruit-sessions,
.accounts-table__th--guide-sessions,
.accounts-table__td--guide-sessions,
.accounts-table__th--sessions,
.accounts-table__td--sessions{
  width: 200px;
  text-align: right;
}

.accounts-table__th--favorite,
.accounts-table__td--favorite {
  width: 100px;
  text-align: center;
}
</style>